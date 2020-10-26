'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const pdfPuppeteer = require('../../common/behaviours/pdf-puppeteer');
const uuid = require('uuid');
const logger = require('../../../lib/logger');
const config = require('../../../config');
const DateUtilities = require('../../../lib/date-utilities');
const _ = require('lodash');
const registry = require('prom-client').register;
const NotifyClient = require('../../../lib/utilities').NotifyClient;

const notifyClient = new NotifyClient(config.govukNotify.notifyApiKey);
const tempLocation = path.resolve(config.pdf.tempLocation);

const applicationErrorsGauge = registry.getSingleMetric('ril_application_errors_gauge');

module.exports = class UploadPDFBase {
  constructor(behaviourConfig) {
    this.behaviourConfig = behaviourConfig;
  }

  createPDF(req, html) {
    return new Promise((resolve, reject) => {
      const applicationUuid = uuid.v1();
      const appName = this.behaviourConfig.app;
      const file = pdfPuppeteer.generate(html, tempLocation, `${applicationUuid}.pdf`, appName);

      logger.info(
        `ril.form.${appName}.submit_form.create_pdf.successful with uuid: ${applicationUuid}`,
        { sessionID: req.sessionID, path: req.path });

      const errorMessage = _.get(file, 'errorMessage');
      return errorMessage ? reject(errorMessage) : resolve(file);
    });
  }

  deleteFile(req, fileToDelete) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };
    const appName = this.behaviourConfig.app;

    fs.unlink(fileToDelete, (err) => {
      if (err) {
        applicationErrorsGauge.inc({ component: 'pdf' }, 1.0);
        logger.error(`ril.form.${appName}.submit_form.delete_pdf.error [${fileToDelete}]`,
          Object.assign({}, loggerObj, { errorMessage: err.message }));
      } else {
        logger.info(
          `ril.form.${appName}.submit_form.delete_pdf.successful [${fileToDelete}]`, loggerObj);
      }
    });
  }

  readCss() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, '../../../public/css/app.css'), (err, data) => {
        return err ? reject(err) : resolve(data);
      });
    });
  }

  readHOLogo() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, '../../../assets/images/ho-logo.png'), (err, data) => {
        return err ? reject(err) : resolve(`data:image/png;base64,${data.toString('base64')}`);
      });
    });
  }

  readPdf(pdfFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pdfFile, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async renderHTML(req, res, locals) {
    if (this.behaviourConfig.sortSections) {
      locals = this.sortSections(locals);
    }

    locals.title = `Refugee integration loan ${this.behaviourConfig.component}`;
    locals.dateTime = moment().format(config.dateTimeFormat);
    locals.values = req.sessionModel.toJSON();
    locals.htmlLang = res.locals.htmlLang || 'en';

    locals.css = await this.readCss(req);
    locals['ho-logo'] = await this.readHOLogo();

    return new Promise((resolve, reject) => {
      res.render('pdf.html', locals, (err, html) => err ? reject(err) : resolve(html));
    });
  }

  sendEmailWithAttachment(req, pdfFile) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };
    const personalisations = this.behaviourConfig.notifyPersonalisations;
    const appName = this.behaviourConfig.app;
    const appComponent = this.behaviourConfig.component;
    const caseworkerEmail = config.govukNotify.caseworkerEmail;

    return new Promise(async(resolve, reject) => {
      try {
        const data = await this.readPdf(pdfFile);

        await notifyClient.sendEmail(config.govukNotify.templateForm[appName], caseworkerEmail, {
          personalisation: Object.assign({}, personalisations, {
            'form id': notifyClient.prepareUpload(data)
          })
        });

        const trackedPageStartTime = Number(req.sessionModel.get('session.started.timestamp'));
        const timeSpentOnForm = DateUtilities.secondsBetween(trackedPageStartTime, new Date());
        registry.getSingleMetric(`ril_${appComponent}_form_duration_gauge`).inc(timeSpentOnForm);

        logger.info(
          `ril.form.${appName}.submit_form.create_email_with_file_notify.successful`, loggerObj);
        logger.info(`ril.form.${appName}.completed`, loggerObj);
        logger.info(
          `ril.${appComponent}.submission.duration=[${timeSpentOnForm}] seconds`, loggerObj);

        return this.sendReceipt(req).then(resolve).catch(reject);
      } catch (err) {
        const errorObj = Object.assign({}, loggerObj, { errorMessage: err.message });
        applicationErrorsGauge.inc({ component: `${appComponent}-form-email` }, 1.0);

        logger.error(
          `ril.form.${appName}.submit_form.create_email_with_file_notify.error`, errorObj);
        logger.error(`ril.form.${appName}.error`, errorObj);
        return reject();
      } finally {
        this.deleteFile(req, pdfFile);
      }
    });
  }

  sendReceipt(req) {
    return new Promise(async(resolve, reject) => {
      if (!this.behaviourConfig.sendReceipt) {
        return resolve();
      }

      const loggerObj = { sessionID: req.sessionID, path: req.path };
      let applicantEmail = req.sessionModel.get('email');
      let applicantPhone = req.sessionModel.get('phone');
      const appName = this.behaviourConfig.app;

      const emailReceiptTemplateId = config.govukNotify.templateEmailReceipt;
      const textReceiptTemplateId = config.govukNotify.templateTextReceipt;

      if (applicantEmail) {
        try {
          await notifyClient.sendEmail(emailReceiptTemplateId, applicantEmail, {});
          logger.info(`ril.form.${appName}.send_receipt.create_email_notify.successful`, loggerObj);
          return resolve();
        } catch (emailErr) {
          logger.error(`ril.form.${appName}.send_receipt.create_email_notify.error`,
            Object.assign({}, loggerObj, { errorMessage: emailErr.message }));
          applicationErrorsGauge.inc({ component: 'receipt-email' }, 1.0);
          return reject(emailErr);
        }
      } else if (applicantPhone) {
        try {
          await notifyClient.sendSms(textReceiptTemplateId, applicantPhone, {});
          logger.info(`ril.form.${appName}.send_receipt.create_text_notify.successful`, loggerObj);
          return resolve();
        } catch (textErr) {
          logger.error(`ril.form.${appName}.send_receipt.create_text_notify.error`,
            Object.assign({}, loggerObj, { errorMessage: textErr.message }));
          applicationErrorsGauge.inc({ component: 'receipt-text' }, 1.0);
          return reject(textErr);
        }
      }

      return reject('No configuration for communication type set!');
    });
  }

  sortSections(locals) {
    const appName = this.behaviourConfig.app;

    const translations = require(`../../${appName}/translations/src/en/pages.json`);
    const sectionHeaders = Object.values(translations.confirm.sections);
    const orderedSections = _.map(sectionHeaders, obj => obj.header);
    let rows = locals.rows;

    rows = rows.slice().sort((a, b) => {
      return orderedSections.indexOf(a.section) - orderedSections.indexOf(b.section);
    });

    locals.rows = rows;
    return locals;
  }

};

'use strict';

const fs = require('fs');
const path = require('path');
const moment = require('moment');
const pdfPuppeteer = require('../../common/behaviours/pdf-puppeteer');
const uuid = require('uuid');
const logger = require('../../../lib/logger');
const config = require('../../../config');
const utilities = require('../../../lib/utilities');
const _ = require('lodash');
const NotifyClient = utilities.NotifyClient;

const notifyClient = new NotifyClient(config.govukNotify.notifyApiKey);
const tempLocation = path.resolve(config.pdf.tempLocation);

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
        const timeSpentOnForm = utilities.secondsBetween(trackedPageStartTime, new Date());

        logger.info(
          `ril.form.${appName}.submit_form.create_email_with_file_notify.successful`, loggerObj);
        logger.info(`ril.form.${appName}.completed`, loggerObj);
        logger.info(
          `ril.${appComponent}.submission.duration=[${timeSpentOnForm}] seconds`, loggerObj);

        return await this.sendReceipt(req).then(resolve).catch(reject);
      } catch (err) {
        const errorObj = Object.assign({}, loggerObj, { errorMessage: err.message });

        logger.error(
          `ril.form.${appName}.submit_form.create_email_with_file_notify.error`, errorObj);
        logger.error(`ril.form.${appName}.error`, errorObj);
        return reject();
      }
    }).catch(() => {
      return Promise.reject();
    }).finally(() => {
      this.deleteFile(req, pdfFile);
    });
  }

  async sendReceipt(req) {
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

      try {
        if (applicantEmail) {
          await this.notifyByEmail(emailReceiptTemplateId, applicantEmail, appName, loggerObj)
            .catch(() => {
              return reject('Error sending email notification!');
            });
        }

        if (applicantPhone) {
          await this.notifyBySms(textReceiptTemplateId, applicantPhone, appName, loggerObj)
            .catch(() => {
              return reject('Error sending sms notification!');
            });
        }
      } catch (err) {
        return reject(err);
      }

      return resolve();
    }).catch(() => {
      return Promise.reject();
    });
  }

  async notifyBySms(textReceiptTemplateId, applicantPhone, appName, loggerObj) {
    try {
      await notifyClient.sendSms(textReceiptTemplateId, applicantPhone, {});
      logger.info(`ril.form.${appName}.send_receipt.create_text_notify.successful`, loggerObj);
      return Promise.resolve();
    } catch (textErr) {
      logger.error(`ril.form.${appName}.send_receipt.create_text_notify.error`,
        Object.assign({}, loggerObj, {errorMessage: textErr.message}));
      return Promise.reject(textErr);
    }
  }

  async notifyByEmail(emailReceiptTemplateId, applicantEmail, appName, loggerObj) {
    try {
      await notifyClient.sendEmail(emailReceiptTemplateId, applicantEmail, {});
      logger.info(`ril.form.${appName}.send_receipt.create_email_notify.successful`, loggerObj);
      return Promise.resolve();
    } catch (emailErr) {
      logger.error(`ril.form.${appName}.send_receipt.create_email_notify.error`,
        Object.assign({}, loggerObj, {errorMessage: emailErr.message}));
      return Promise.reject(emailErr);
    }
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

'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const registry = require('prom-client').register;
const translations = require('../translations/en/default.json');
const config = require('../../../config');
const logger = require('../../../lib/logger');
const pdfPuppeteer = require('../../common/behaviours/util/pdf-puppeteer');
const uuid = require('uuid');
const NotifyClient = require('../../../lib/utilities').NotifyClient;

const caseworkerEmail = config.govukNotify.caseworkerEmail;
const templateId = config.govukNotify.templateFormApply;
const emailReceiptTemplateId = config.govukNotify.templateEmailReceipt;
const textReceiptTemplateId = config.govukNotify.templateTextReceipt;
const notifyApiKey = config.govukNotify.notifyApiKey;
const tempLocation = path.resolve(config.pdf.tempLocation);

const notifyClient = new NotifyClient(notifyApiKey);

const applicationErrorsGauge = registry.getSingleMetric('ril_application_errors_gauge');
const applicationFormDurationGauge = registry.getSingleMetric('ril_application_form_duration_gauge');

module.exports = superclass => class extends superclass {

  pdfLocals(req, res) {
    let sections = req.form.options.sections;
    req.form.options.sections = req.form.options.pdfSections;

    try {
      return super.locals(req, res);
    } finally {
      req.form.options.sections = sections;
    }
  }

  async successHandler(req, res, next) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };

    try {
      var html = await this.renderHTML(req, res);
      var pdfFile = await this.createPDF(req, html);
      await this.sendEmailWithAttachment(req, pdfFile);

      logger.info('ril.form.apply.submit_form.successful', loggerObj);
      return super.successHandler(req, res, next);
    } catch (err) {
      logger.error('ril.form.apply.submit_form.error', loggerObj);
      applicationErrorsGauge.inc({ component: 'application-form-submission' }, 1.0);
      return next(Error('There was an error sending your loan application form'));
    }
  }

  sendEmailWithAttachment(req, pdfFile) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };

    return new Promise(async(resolve, reject) => {
      try {
        var data = await this.readPdf(pdfFile);

        await notifyClient.sendEmail(templateId, caseworkerEmail, {
          personalisation: {
            'form id': notifyClient.prepareUpload(data),
            'name': req.sessionModel.get('fullName')
          }
        });

        var trackedPageStartTime = Number(req.sessionModel.get('session.started.timestamp'));
        var timeSpentOnForm = this.secondsSince(trackedPageStartTime);
        applicationFormDurationGauge.inc(timeSpentOnForm);

        logger.info('ril.form.apply.submit_form.create_email_with_file_notify.successful', loggerObj);
        logger.info('ril.form.apply.completed', loggerObj);
        logger.info(`ril.application.submission.duration=[${timeSpentOnForm}] seconds`, loggerObj);

        this.sendReceipt(req);
        return resolve();
      } catch (err) {
        const errorObj = Object.assign({}, loggerObj, { errorMessage: err.message });
        applicationErrorsGauge.inc({ component: 'application-form-email' }, 1.0);

        logger.error('ril.form.apply.submit_form.create_email_with_file_notify.error', errorObj);
        logger.error('ril.form.apply.error', errorObj);
        return reject();
      } finally {
        this.deleteFile(req, pdfFile);
      }
    });
  }

  secondsSince(startDate) {
    var now = new Date();
    var dif = now - startDate;
    var secondsFromStartToNow = dif / 1000;
    return Math.abs(secondsFromStartToNow);
  }

  deleteFile(req, fileToDelete) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };

    fs.unlink(fileToDelete, (err) => {
      if (err) {
        applicationErrorsGauge.inc({ component: 'pdf' }, 1.0);
        logger.error(`ril.form.apply.submit_form.delete_pdf.error [${fileToDelete}]`,
          Object.assign({}, loggerObj, { errorMessage: err.message }));
      } else {
        logger.info(`ril.form.apply.submit_form.delete_pdf.successful [${fileToDelete}]`, loggerObj);
      }
    });
  }

  readPdf(pdfFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pdfFile, (err, data) => err ? reject(err) : resolve(data));
    });
  }

  async sendReceipt(req) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };
    let applicantEmail = req.sessionModel.get('email');
    let applicantPhone = req.sessionModel.get('phone');

    if (applicantEmail) {
      try {
        await notifyClient.sendEmail(emailReceiptTemplateId, applicantEmail, {});
        logger.info('ril.form.apply.send_receipt.create_email_notify.successful', loggerObj);
      } catch (emailErr) {
        logger.error('ril.form.apply.send_receipt.create_email_notify.error',
            Object.assign({}, loggerObj, { errorMessage: emailErr.message }));
        applicationErrorsGauge.inc({ component: 'receipt-email' }, 1.0);
      }
    } else if (applicantPhone) {
      try {
        await notifyClient.sendSms(textReceiptTemplateId, applicantPhone, {});
        logger.info('ril.form.apply.send_receipt.create_text_notify.successful', loggerObj);
      } catch (emailErr) {
        logger.error('ril.form.apply.send_receipt.create_text_notify.error',
            Object.assign({}, loggerObj, { errorMessage: emailErr.message }));
        applicationErrorsGauge.inc({ component: 'receipt-text' }, 1.0);
      }
    }
  }

  async renderHTML(req, res) {
    let locals = Object.assign({}, this.pdfLocals(req, res));
    locals = this.sortSections(locals);

    locals.title = 'Refugee integration loan application';
    locals.dateTime = moment().format(config.dateTimeFormat);
    locals.values = req.sessionModel.toJSON();
    locals.htmlLang = res.locals.htmlLang || 'en';

    locals.css = await this.readCss(req);
    locals['ho-logo'] = await this.readHOLogo();

    return new Promise((resolve, reject) => {
      res.render('pdf.html', locals, (err, html) => err ? reject(err) : resolve(html));
    });
  }

  sortSections(locals) {
    const sectionHeaders = Object.values(translations.pages.confirm.sections);
    const orderedSections = _.map(sectionHeaders, obj => obj.header);
    let rows = locals.rows;

    rows = rows.slice().sort((a, b) => {
      return orderedSections.indexOf(a.section) - orderedSections.indexOf(b.section);
    });

    locals.rows = rows;
    return locals;
  }

  createPDF(req, html) {
    return new Promise((resolve, reject) => {
      const applicationUuid = uuid.v1();
      const file = pdfPuppeteer.generate(html, tempLocation, `${applicationUuid}.pdf`, 'apply');

      logger.info(`ril.form.apply.submit_form.create_pdf.successful with uuid: ${applicationUuid}`,
          { sessionID: req.sessionID, path: req.path });

      const errorMessage = _.get(file, 'errorMessage');
      return errorMessage ? reject(errorMessage) : resolve(file);
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

};

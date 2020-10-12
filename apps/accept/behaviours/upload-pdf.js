'use strict';

const fs = require('fs');
const path = require('path');
const mix = require('mixwith').mix;
const moment = require('moment');
const config = require('../../../config');
const logger = require('../../../lib/logger');
const registry = require('prom-client').register;
const summaryData = require('hof-behaviour-loop').SummaryWithLoopItems;
const pdfPuppeteer = require('../../common/behaviours/util/pdf-puppeteer');
const uuid = require('uuid');
const NotifyClient = require('../../../lib/utilities').NotifyClient;

const caseworkerEmail = config.govukNotify.caseworkerEmail;
const templateId = config.govukNotify.templateFormAccept;
const notifyApiKey = config.govukNotify.notifyApiKey;

const applicationErrorsGauge = registry.getSingleMetric('ril_application_errors_gauge');
const acceptanceFormDurationGauge = registry.getSingleMetric('ril_acceptance_form_duration_gauge');

const tempLocation = path.resolve(config.pdf.tempLocation);
const notifyClient = new NotifyClient(notifyApiKey);

module.exports = superclass => class extends mix(superclass).with(summaryData) {

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

      logger.info('ril.form.accept.submit_form.successful', loggerObj);
      return super.successHandler(req, res, next);
    } catch (err) {
      logger.error('ril.form.accept.submit_form.error', loggerObj);
      applicationErrorsGauge.inc({ component: 'acceptance-form-submission' }, 1.0);
      return next(Error('There was an error sending your loan acceptance form'));
    }
  }

  readPdf(pdfFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pdfFile, (err, data) => err ? reject(err) : resolve(data));
    });
  }

sendEmailWithAttachment(req, pdfFile) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };

    return new Promise(async(resolve, reject) => {
      try {
        var data = await this.readPdf(pdfFile);

        await notifyClient.sendEmail(templateId, caseworkerEmail, {
          personalisation: {
            'form id': notifyClient.prepareUpload(data),
            'name': req.sessionModel.get('loanReference')
          }
        });

        var trackedPageStartTime = Number(req.sessionModel.get('session.started.timestamp'));
        var timeSpentOnForm = this.secondsSince(trackedPageStartTime);
        acceptanceFormDurationGauge.inc(timeSpentOnForm);

        logger.info('ril.form.accept.submit_form.create_email_with_file_notify.successful', loggerObj);
        logger.info('ril.form.accept.completed', loggerObj);
        logger.info(`ril.acceptance.submission.duration=[${timeSpentOnForm}] seconds`, loggerObj);

        return resolve();

      } catch (err) {
        const errorObj = Object.assign({}, loggerObj, { errorMessage: err.message });
        applicationErrorsGauge.inc({ component: 'email' }, 1.0);

        logger.error('ril.form.accept.submit_form.create_email_with_file_notify.error', errorObj);
        logger.error('ril.form.accept.error', errorObj);
        return reject();
      } finally {
        this.deleteFile(req, pdfFile);
      }
    });
  }

  deleteFile(req, fileToDelete) {
    fs.unlink(fileToDelete, (err) => {
      if (err) {
        applicationErrorsGauge.inc({ component: 'pdf' }, 1.0);
        logger.error(`ril.form.accept.submit_form.delete_pdf.error [${fileToDelete}]`,
          { errorMessage: err.message, sessionID: req.sessionID, path: req.path });
      } else {
        logger.info(`ril.form.accept.submit_form.delete_pdf.successful [${fileToDelete}]`,
          { sessionID: req.sessionID, path: req.path });
      }
    });
  }

  async renderHTML(req, res) {
    const locals = Object.assign({}, this.pdfLocals(req, res));
    locals.title = 'Refugee integration loan acceptance';
    locals.dateTime = moment().format(config.dateTimeFormat) + ' (GMT)';
    locals.values = req.sessionModel.toJSON();
    locals.htmlLang = res.locals.htmlLang || 'en';

    locals.css = await this.readCss(req);
    locals['ho-logo'] = await this.readHOLogo();

    return new Promise((resolve, reject) => {
      res.render('pdf.html', locals, (err, html) => err ? reject(err) : resolve(html));
    });
  }

  createPDF(req, html) {
    return new Promise((resolve, reject) => {
      const applicationUuid = uuid.v1();
      const file = pdfPuppeteer.generate(html, tempLocation, `${applicationUuid}.pdf`, 'accept');
      logger.info(`ril.form.accept.submit_form.create_pdf.successful with uuid: ${applicationUuid}`,
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

'use strict';

const fs = require('fs');
const path = require('path');
const mix = require('mixwith').mix;
const moment = require('moment');
const config = require('../../../config');

const logger = require('../../../lib/logger');

const summaryData = require('hof-behaviour-loop').SummaryWithLoopItems;
const pdfPuppeteer = require('../../common/behaviours/util/pdf-puppeteer');

const uuid = require('uuid');
const tempLocation = path.resolve(config.pdf.tempLocation);

const caseworkerEmail = config.govukNotify.caseworkerEmail;
const templateId = config.govukNotify.templateFormAccept;
const notifyApiKey = config.govukNotify.notifyApiKey;

const NotifyClient = require('../../../lib/utilities').NotifyClient;
const notifyClient = new NotifyClient(notifyApiKey);

const client = require('prom-client');
const registry = client.register;
const applicationErrorsGauge = registry.getSingleMetric('ril_application_errors_gauge');
const acceptanceFormDurationGauge = registry.getSingleMetric('ril_acceptance_form_duration_gauge');

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

  successHandler(req, res, next) {
    this.renderHTML(req, res)
    .then(html => this.createPDF(req, html))
    .then((pdfFile) => this.sendEmailWithAttachment(req, pdfFile))
    .then(() => {
      logger.info('ril.form.accept.submit_form.successful', {sessionID: req.sessionID, path: req.path});
      super.successHandler(req, res, next);
    })
    .catch(() => {
      logger.error('ril.form.accept.submit_form.error', {sessionID: req.sessionID, path: req.path});
      applicationErrorsGauge.inc({component: 'acceptance-form-submission'}, 1.0);
      next(Error('There was an error sending your loan acceptance form'));
    });
  }

  readPdf(pdfFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pdfFile, (err, data) => {
        return err ? reject(err) : resolve(data);
      });
    });
  }

  sendEmailWithAttachment(req, pdfFile) {
    return new Promise((resolve, reject) => {
      this.readPdf(pdfFile)
      .then(data => {
        notifyClient.sendEmail(templateId, caseworkerEmail, {
          personalisation: {
            'form id': notifyClient.prepareUpload(data),
            'loan reference': req.sessionModel.get('loanReference')
          }
        })
        .then(() => {
          logger.info('ril.form.accept.submit_form.create_email_with_file_notify.successful',
              {sessionID: req.sessionID, path: req.path});
          logger.info('ril.form.accept.completed', {sessionID: req.sessionID, path: req.path});
          var trackedPageStartTime = Number(req.sessionModel.get('session.started.timestamp'));
          var timeSpentOnForm = this.secondsSince(trackedPageStartTime);
          acceptanceFormDurationGauge.inc(timeSpentOnForm);
          logger.info(`ril.acceptance.submission.duration=[${timeSpentOnForm}] seconds`,
              {sessionID: req.sessionID, path: req.path});
          return resolve();
        })
        .catch((err) => {
          applicationErrorsGauge.inc({component: 'email'}, 1.0);

          logger.error('ril.form.accept.submit_form.create_email_with_file_notify.error',
              {errorMessage: err.message, sessionID: req.sessionID, path: req.path});
          logger.error('ril.form.accept.error', {errorMessage: err.message, sessionID: req.sessionID, path: req.path});
          return reject();
        })
        .finally(() => this.deleteFile(req, pdfFile));
      });
    });
  }

  deleteFile(req, fileToDelete) {
    fs.unlink(fileToDelete, (err) => {
      if (err) {
        applicationErrorsGauge.inc({component: 'pdf'}, 1.0);
        logger.error(`ril.form.accept.submit_form.delete_pdf.error [${fileToDelete}]`,
            {errorMessage: err.message, sessionID: req.sessionID, path: req.path});
      } else {
        logger.info(`ril.form.accept.submit_form.delete_pdf.successful [${fileToDelete}]`,
            {sessionID: req.sessionID, path: req.path});
      }
    });
  }

  renderHTML(req, res) {
    const locals = Object.assign({}, this.pdfLocals(req, res));
    locals.title = 'Refugee integration loan acceptance';
    locals.dateTime = moment().format(config.dateTimeFormat) + ' (GMT)';
    locals.values = req.sessionModel.toJSON();
    locals.htmlLang = res.locals.htmlLang || 'en';

    return Promise.resolve()
    .then(() => {
      return this.readCss(req)
      .then(css => {
        locals.css = css;
      });
    })
    .then(() => {
      return this.readHOLogo()
      .then(img => {
        locals['ho-logo'] = img;
      });
    })
    .then(() => {
      return new Promise((resolve, reject) => {
        res.render('pdf.html', locals, (err, html) => {
          if (err) {
            return reject(err);
          }
          return resolve(html);
        });
      });
    });
  }

  createPDF(req, html) {
    return new Promise((resolve) => {
      const applicationUuid = uuid.v1();
      const file = pdfPuppeteer.generate(html, tempLocation, `${applicationUuid}.pdf`, 'accept');
      logger.info(`ril.form.accept.submit_form.create_pdf.successful with uuid: ${applicationUuid}`,
          {sessionID: req.sessionID, path: req.path});
      return resolve(file);
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

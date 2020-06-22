'use strict';

const fs = require('fs');
const path = require('path');
const mix = require('mixwith').mix;
const moment = require('moment');
const config = require('../../../config');
const UploadModel = require('../models/upload');

const summaryData = require('hof-behaviour-loop').SummaryWithLoopItems;
const pdfPuppeteer = require('./util/pdf-puppeteer');
const uuid = require('uuid');
const tempLocation = path.resolve(config.pdf.tempLocation);

const caseworkerEmail = config.govukNotify.caseworkerEmail;
const templateId = config.govukNotify.templateFormAccept;
const notifyApiKey = config.govukNotify.notifyApiKey;
const NotifyClient = require('notifications-node-client').NotifyClient;
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
    req.log('info', 'Acceptance Form Submission Processing');
    this.renderHTML(req, res)
    .then(html => this.createPDF(req, html))
    .then((pdfFile) => this.sendEmailWithAttachment(req, pdfFile))
    .then(() => {
      req.log('Processing of acceptance form submission OK');
      super.successHandler(req, res, next);
    })
    .catch((err) => {
      req.log('error', 'Issue with acceptance-form-submission ' + err);
      applicationErrorsGauge.inc({ component: 'acceptance-form-submission' }, 1.0);
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
          req.log('info', 'Notify - Sending acceptance form email with attachment OK!');
          req.log('info', 'ril.acceptance.submission.ok');
          var trackedPageStartTime = Number(req.sessionModel.get('session.started.timestamp'));
          var timeSpentOnForm = this.secondsSince(trackedPageStartTime);
          acceptanceFormDurationGauge.inc(timeSpentOnForm);
          req.log('info', 'ril.acceptance.submission.duration=[' + timeSpentOnForm + '] seconds');
          return resolve();
        })
        .catch((err) => {
          applicationErrorsGauge.inc({ component: 'email' }, 1.0);
          req.log('error', 'Notify - Sending acceptance form email with attachment error! reason: ' + err);
          req.log('error', 'ril.acceptance.submission.error');
          return reject();
        })
        .finally(() => this.deleteFile(req, pdfFile));
    });
   });
  }

  deleteFile(req, fileToDelete) {
    fs.unlink(fileToDelete, (err) => {
      if (err) {
          applicationErrorsGauge.inc({ component: 'pdf' }, 1.0);
          req.log('error', 'DELETE: ERROR! PDF File [' + fileToDelete + '] NOT deleted! ' + err);
      } else {
          req.log('info', 'DELETE: OK! PDF File [' + fileToDelete + '] deleted!');
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

  uploadPdf(file) {
    const model = new UploadModel();
    model.set(file);
    return model.save();
  }

  createPDF(req, html) {
    return new Promise((resolve) => {
      const file = pdfPuppeteer.generate(html, tempLocation, `${uuid.v1()}.pdf`);
      req.log('info', '**** Acceptance Form PDF File created **** ');
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

'use strict';

const fs = require('fs');
const path = require('path');
const mix = require('mixwith').mix;
const moment = require('moment');
const config = require('../../../config');

const summaryData = require('hof-behaviour-loop').SummaryWithLoopItems;
const pdfPuppeteer = require('./util/pdf-puppeteer');
const uuid = require('uuid');
const tempLocation = path.resolve(config.pdf.tempLocation);

const caseworkerEmail = config.govukNotify.caseworkerEmail;
const templateId = config.govukNotify.templateFormApply;
const emailReceiptTemplateId = config.govukNotify.templateEmailReceipt;
const textReceiptTemplateId = config.govukNotify.templateTextReceipt;
const notifyApiKey = config.govukNotify.notifyApiKey;
const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(notifyApiKey);

const client = require('prom-client');
const registry = client.register;
const applicationErrorsGauge = registry.getSingleMetric('ril_application_errors_gauge');
const applicationFormDurationGauge = registry.getSingleMetric('ril_application_form_duration_gauge');

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
      req.log('info', 'ril.form.apply.submit_form.successful');
      super.successHandler(req, res, next);
    })
    .catch((err) => {
      req.log('error', 'ril.form.apply.submit_form.error ' + err);
      applicationErrorsGauge.inc({ component: 'application-form-submission' }, 1.0);
      next(Error('There was an error sending your loan application form'));
    });
  }

  sendEmailWithAttachment(req, pdfFile) {
    return new Promise((resolve, reject) => {
    this.readPdf(pdfFile)
    .then(data => {
      notifyClient.sendEmail(templateId, caseworkerEmail, {
        personalisation: {
          'form id': notifyClient.prepareUpload(data),
          'name': req.sessionModel.get('fullName')
          }
        })
        .then(() => {
          req.log('info', 'ril.form.apply.submit_form.create_email_with_file_notify.successful');
          req.log('info', 'ril.form.apply.completed');
          var trackedPageStartTime = Number(req.sessionModel.get('session.started.timestamp'));
          var timeSpentOnForm = this.secondsSince(trackedPageStartTime);
          applicationFormDurationGauge.inc(timeSpentOnForm);
          req.log('info', 'ril.application.submission.duration=[' + timeSpentOnForm + '] seconds');
          this.sendReceipt(req);
          return resolve();
        })
        .catch((err) => {
          applicationErrorsGauge.inc({ component: 'application-form-email' }, 1.0);
          req.log('error', 'ril.form.apply.submit_form.create_email_with_file_notify.error ' + err);
          req.log('info', 'ril.form.apply.error');
          return reject();
        })
        .finally(() => this.deleteFile(req, pdfFile));
    });
   });
  }

  secondsSince(startDate) {
    var now = new Date();
    var dif = now - startDate;
    var secondsFromStartToNow = dif / 1000;
    return Math.abs(secondsFromStartToNow);
  }

  deleteFile(req, fileToDelete) {
    fs.unlink(fileToDelete, (err) => {
      if (err) {
          applicationErrorsGauge.inc({ component: 'pdf' }, 1.0);
          req.log('error', 'ril.form.apply.submit_form.delete_pdf.error [' + fileToDelete + ']', err);
      } else {
          req.log('info', 'ril.form.apply.submit_form.delete_pdf.successful [' + fileToDelete + ']');
      }
    });
  }

  readPdf(pdfFile) {
    return new Promise((resolve, reject) => {
      fs.readFile(pdfFile, (err, data) => {
        return err ? reject(err) : resolve(data);
      });
    });
  }

  sendReceipt(req) {
    let applicantEmail = req.sessionModel.get('email');
    let applicantPhone = req.sessionModel.get('phone');
    if (applicantEmail) {
      notifyClient.sendEmail(emailReceiptTemplateId, applicantEmail, {})
      .then(() => {
          req.log('info', 'ril.form.apply.send_receipt.create_email_notify.successful');
      })
      .catch((emailErr) => {
        req.log('error', 'ril.form.apply.send_receipt.create_email_notify.error', emailErr);
        applicationErrorsGauge.inc({ component: 'receipt-email' }, 1.0);
      });
    } else if (applicantPhone) {
      notifyClient.sendSms(textReceiptTemplateId, applicantPhone, {})
      .then(() => {
          req.log('info', 'ril.form.apply.send_receipt.create_text_notify.successful');
      })
      .catch((emailErr) => {
        req.log('error', 'ril.form.apply.send_receipt.create_text_notify.error', emailErr);
        applicationErrorsGauge.inc({ component: 'receipt-text' }, 1.0);
      });
    }
  }

  renderHTML(req, res) {
    const locals = Object.assign({}, this.pdfLocals(req, res));
    locals.title = 'Refugee integration loan application';
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
      const file = pdfPuppeteer.generate(html, tempLocation, `${uuid.v1()}.pdf`);
      req.log('info', 'ril.form.apply.submit_form.create_pdf.successful');
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

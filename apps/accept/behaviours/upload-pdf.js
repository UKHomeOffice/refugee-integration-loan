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

const createTemporaryFileName = () => {
  return (`${uuid.v1()}.pdf`);
};

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

  process(req, res, next) {
    const pdfFileName = createTemporaryFileName();
    this.renderHTML(req, res)
      .then(html => {
        req.log('info', 'Creating PDF document from generated HTML');
        return this.createPDF(req, html, pdfFileName);
      })
      .then(pdfFile => {
        let isEmailSubmissionOk = this.sendEmailWithAttachment(req, pdfFile);
        if (typeof isEmailSubmissionOk === 'undefined' || isEmailSubmissionOk === false) {
          this.deleteFile(req, pdfFile);
          next(Error('There was an error submitting your loan acceptance form. TODO: copy needed'));
        } else {
          this.deleteFile(req, pdfFile);
          super.process(req, res, next);
        }
      });
  }

  sendEmailWithAttachment(req, pdfFile) {
    fs.readFile(pdfFile, (err, pdfFileContents) => {
      if (err) {
        req.log('error', 'PDF Read: ERROR ' + err);
        applicationErrorsGauge.inc({ component: 'pdf' }, 1.0);
      } else {
        notifyClient.sendEmail(templateId, caseworkerEmail, {
          personalisation: {
            'form id': notifyClient.prepareUpload(pdfFileContents),
            'loan reference': req.sessionModel.get('loanReference')
          }
        })
        .then(response => {
          req.log('info', 'EMAIL Submission with attachment: OK. Response: ' + response);
          return true;
        })
        .catch((emailErr) => {
          req.log('error', 'EMAIL: ERROR ' + emailErr);
          applicationErrorsGauge.inc({ component: 'email' }, 1.0);
          return false;
        });
      }
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

  async createPDF(req, html, fileName) {
    req.log('info', '**** Creating PDF File **** ' + fileName);
    const file = await pdfPuppeteer.generate(html, tempLocation, fileName);
    req.log('info', '**** PDF File created **** ' + file);
    fs.stat(file, (err, stats) => {
      if (err) {
        req.log('error', err);
      }
      if (stats.isFile()) {
          req.log('info', '    Type: file');
      }
      if (stats.isDirectory()) {
          req.log('info', '    Type: directory');
      }

      req.log('info', '    size: ' + stats.size);
      req.log('info', '    mode: ' + stats.mode);
    });

    return file;
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

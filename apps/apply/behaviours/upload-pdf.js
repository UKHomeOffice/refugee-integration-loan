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
const templateId = config.govukNotify.templateFormApply;
const notifyApiKey = config.govukNotify.notifyApiKey;
const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(notifyApiKey);

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
        req.log('info', 'PDF CREATION: File [' + pdfFile + ']');

        // Use Notify to upload files
        fs.readFile(pdfFile, (err, pdfFileContents) => {
          if (err) {
            req.log('error', err);
          }
          notifyClient.sendEmail(templateId, caseworkerEmail, {
            personalisation: {
              'form id': notifyClient.prepareUpload(pdfFileContents),
              'name': req.sessionModel.get('fullName')
            }
          })
          .then(response => req.log('info', 'EMAIL: OK ' + response.body))
          .catch(emailErr => req.log('info', 'EMAIL: ERROR ' + emailErr));
        });
        return pdfFile;
      })
      .then(pdfFile => {
        fs.unlink(pdfFile, (err) => {
          if (err) {
              req.log('info', 'DELETE: ERROR! PDF File [' + pdfFile + '] NOT deleted! ' + err);
          } else {
              req.log('info', 'DELETE: OK! PDF File [' + pdfFile + '] deleted!');
          }
        });
        req.log('info', 'PDF Processing ** END **');
        // req.form.values['pdf-upload'] = result.url;
      })
      .then(() => {
        super.process(req, res, next);
      }, next)
      .catch((err) => {
        next(err);
      });
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

'use strict';

const fs = require('fs');
const path = require('path');
const mix = require('mixwith').mix;
const moment = require('moment');
const config = require('../../../config');
const UploadModel = require('../models/upload');

const summaryData = require('./summary');
const pdfPuppeteer = require('./util/pdf-puppeteer');
const uuid = require('uuid');
const tempLocation = path.resolve(config.pdf.tempLocation);

const bucketName = config.upload.bucketName;
const awsAccessKeyId = config.upload.awsAccessKeyId;
const awsSecretAccessKey = config.upload.awsSecretAccessKey;
const kmsKey = config.upload.kmsKey;

const createTemporaryFileName = () => {
  return (`${uuid.v1()}.pdf`);
};

module.exports = superclass => class extends mix(superclass).with(summaryData) {

  process(req, res, next) {
    req.log('info', 'Upload-pdf processing ** START **');
    this.renderHTML(req, res)
      .then(html => {
        req.log('info', 'Creating PDF document');
        return this.createPDF(html);
      })
      .then(pdfBuffer => {
        req.log('info', 'Created PDF document. Uploading. ** UPLOAD is DISABLED **');
        if (typeof bucketName !== 'undefined' && bucketName !== 'test_bucket' )
        {
          req.log('info', 'S3 Variables set using SECRETS');
        }
        else
        {
          req.log('info', 'S3 Variables set using TEST DATA');
        }
        // return this.uploadPdf({
        //   name: 'application_form.pdf',
        //   data: pdfBuffer,
        //   mimetype: 'application/pdf'
        // });
      })
      .then(() => { // todo: add result to be processed by this function
        req.log('info', 'Saved PDF document to S3. ** UPLOAD is DISABLED **');
        //req.form.values['pdf-upload'] = result.url;
      })
      .then(() => {
        super.process(req, res, next);
      }, next)
      .catch((err) => {
        next(err);
      });
  }

  renderHTML(req, res) {
    const locals = Object.assign({}, this.locals(req, res));
    locals.title = 'Request has been received';
    locals.dateTime = moment().format(config.dateTimeFormat) + ' (GMT)';
    locals.values = req.sessionModel.toJSON();

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
            resolve(html);
          });
        });
      });
  }

  uploadPdf(file) {
    const model = new UploadModel();
    model.set(file);
    return model.save();
  }

  async createPDF(html) {
    const tempName = createTemporaryFileName();

    console.log('    tempLocation: ' + tempLocation);
    console.log('    tempName: ' + tempName);
    const file = await pdfPuppeteer.generate(html, tempLocation, tempName);
    console.log('info', '**** PDF File created **** ' + file);
    fs.stat(file, function(err, stats) {
        if (stats.isFile()) {
            console.log('    Type: file');
        }
        if (stats.isDirectory()) {
            console.log('    Type: directory');
        }
    
        console.log('    size: ' + stats["size"]);
        console.log('    mode: ' + stats["mode"])
    });

    fs.readFile(file, (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      return data;
    })
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

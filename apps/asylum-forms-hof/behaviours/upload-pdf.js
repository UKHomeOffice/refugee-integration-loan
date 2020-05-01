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

const caseworkerEmail = config.govukNotify.caseworkerEmail;
const templateId = config.govukNotify.templateFormSubmission;
const notifyApiKey = config.govukNotify.notifyApiKey;
const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(notifyApiKey);

const createTemporaryFileName = () => {
  return (`${uuid.v1()}.pdf`);
};

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
});

module.exports = superclass => class extends mix(superclass).with(summaryData) {

  process(req, res, next) {
    req.log('info', 'PDF Processing ** START **');

    const pdfFileName = createTemporaryFileName();
    this.renderHTML(req, res)
      .then(html => {
        req.log('info', 'Creating PDF document from generated HTML');
        return this.createPDF(html, pdfFileName);
      })
      .then(pdfFile => {
        req.log('info', 'PDF CREATION: File [' + pdfFile + ']');
        if (typeof bucketName !== 'undefined' && bucketName !== 'test_bucket' )
        {
          req.log('info', 'S3 Variables set using SECRETS');
        }
        else
        {
          req.log('info', 'S3 Variables set using TEST DATA');
        }
        const params = {
            Bucket: bucketName,
            Key: pdfFileName,
            Body: fs.createReadStream(pdfFile),
            ServerSideEncryption: 'aws:kms',
            SSEKMSKeyId: kmsKey,
            ContentType: 'application/pdf'
        };
        s3.upload(params, function(err, data) {
            if (err) {
                req.log('info', 'UPLOAD: ERROR! File [' + pdfFile + '] NOT uploaded successfully to the S3 Bucket. File was not delelted from local storage. ' + err);
            } else {
                req.log('info', 'UPLOAD: OK! File [' + pdfFile + '] uploaded successfully to the S3 Bucket ' + data.Location);
                fs.unlink(pdfFile, function (err) {
                  if (err) {
                      req.log('info', 'DELETE: ERROR! PDF File [' + pdfFile + '] NOT deleted! ' + err);
                  } else {
                      req.log('info', 'DELETE: OK! PDF File [' + pdfFile + '] deleted!');
                  } 
                });
                // Send email
                notifyClient.sendEmail(templateId, caseworkerEmail, {
                        personalisation: {
                          'form id': pdfFileName
                        }
                      }).then(response => console.log('EMAIL: OK ' + response))
                      .catch(err => console.error('EMAIL: ERROR ' + err));
            }
        });
      })
      .then(() => { // todo: add result to be processed by this function
        req.log('info', 'PDF Processing ** END **');
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

  async createPDF(html, fileName) {
    console.log('    tempLocation: ' + tempLocation);
    console.log('    fileName: ' + fileName);
    const file = await pdfPuppeteer.generate(html, tempLocation, fileName);
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

'use strict';

const logger = require('../../../lib/logger');
const UploadPdfShared = require('../../common/behaviours/upload-pdf-base');
const config = require('../../../config');

const confirmStep = config.routes.confirmStep;
const SubmissionError = require('../../common/behaviours/submission-error');

module.exports = superclass => class extends superclass {

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async pollPdf(req, res, next, tries) {
    if (tries > 5) {
      throw new Error('Error in generating/sending pdf!');
    }
    await this.sleep(2000);

    if (this.options.steps[confirmStep].submitted) {
      return super.successHandler(req, res, next);
    }
    return await this.pollPdf(req, res, next, tries + 1);
  }

  pdfLocals(req, res) {
    let sections = req.form.options.sections;
    req.form.options.sections = req.form.options.pdfSections;

    const superLocals = super.locals(req, res);
    req.form.options.sections = sections;

    return superLocals;
  }

  async successHandler(req, res, next) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };

    try {
      if (!this.options.steps[confirmStep].uploadPdfShared) {
        const uploadPdfShared = new UploadPdfShared({
          app: 'accept',
          component: 'acceptance',
          sendReceipt: false,
          sortSections: false,
          notifyPersonalisations: {
            'loan reference': req.sessionModel.get('loanReference')
          }
        });

        this.options.steps[confirmStep].uploadPdfShared = uploadPdfShared;

        const locals = Object.assign({}, this.pdfLocals(req, res));

        const html = await uploadPdfShared.renderHTML(req, res, locals);
        const pdfFile = await uploadPdfShared.createPDF(req, html);
        await uploadPdfShared.sendEmailWithAttachment(req, pdfFile);

        this.options.steps[confirmStep].submitted = true;
        logger.info('ril.form.accept.submit_form.successful', loggerObj);
        return super.successHandler(req, res, next);
      }
      return await this.pollPdf(req, res, next, 0);
    } catch (err) {
      logger.error('ril.form.accept.submit_form.error', loggerObj, err);
      return next(new SubmissionError('submissionError', {
        type: 'submissionFailed',
        message: 'Error submitting acceptance form'
      }));
    }
  }
};

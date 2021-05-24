
const UploadPdfShared = require('../../common/behaviours/upload-pdf-base');
const config = require('../../../config');
const confirmStep = config.routes.confirmStep;

module.exports = superclass => class extends superclass {
  sleep(ms) {
    return new Promise(resolve => {
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
    return this.pollPdf(req, res, next, tries + 1);
  }

  pdfLocals(req, res) {
    const sections = req.form.options.sections;
    req.form.options.sections = req.form.options.pdfSections;

    const superLocals = super.locals(req, res);
    req.form.options.sections = sections;

    return superLocals;
  }

  async successHandler(req, res, next) {
    try {
      if (!this.options.steps[confirmStep].uploadPdfShared) {
        const uploadPdfShared = new UploadPdfShared({
          app: 'apply',
          component: 'application',
          sendReceipt: true,
          sortSections: true,
          notifyPersonalisations: {
            name: req.sessionModel.get('fullName')
          }
        });

        this.options.steps[confirmStep].uploadPdfShared = uploadPdfShared;

        const locals = Object.assign({}, this.pdfLocals(req, res));

        const html = await uploadPdfShared.renderHTML(req, res, locals);
        const pdfFile = await uploadPdfShared.createPDF(req, html);
        await uploadPdfShared.sendEmailWithAttachment(req, pdfFile);

        this.options.steps[confirmStep].submitted = true;

        req.log('info', 'ril.form.apply.submit_form.successful');
        return super.successHandler(req, res, next);
      }
      const pdfPoll = await this.pollPdf(req, res, next, 0);
      return pdfPoll;
    } catch (err) {
      req.log('error', 'ril.form.apply.submit_form.error', err.message || err);
      return next(err);
    }
  }
};

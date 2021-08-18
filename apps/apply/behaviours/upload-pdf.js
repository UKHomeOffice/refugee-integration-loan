
const UploadPdfShared = require('../../common/behaviours/upload-pdf-base');

module.exports = superclass => class extends superclass {
  async successHandler(req, res, next) {
    try {
      const uploadPdfShared = new UploadPdfShared({
        app: 'apply',
        component: 'application',
        sendReceipt: true,
        sortSections: true,
        notifyPersonalisations: {
          name: req.sessionModel.get('fullName')
        }
      });

      await uploadPdfShared.send(req, res, super.locals(req, res));

      req.log('info', 'ril.form.apply.submit_form.successful');
      return super.successHandler(req, res, next);
    } catch (err) {
      req.log('error', 'ril.form.apply.submit_form.error', err.message || err);
      return next(err);
    }
  }
};

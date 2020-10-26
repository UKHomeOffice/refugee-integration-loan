'use strict';

const registry = require('prom-client').register;
const logger = require('../../../lib/logger');
const UploadPdfShared = require('../../common/behaviours/upload-pdf-base');

module.exports = superclass => class extends superclass {

  pdfLocals(req, res) {
    let sections = req.form.options.sections;
    req.form.options.sections = req.form.options.pdfSections;

    const superLocals = super.locals(req, res);
    req.form.options.sections = sections;

    return superLocals;
  }

  async successHandler(req, res, next) {
    const loggerObj = { sessionID: req.sessionID, path: req.path };

    const sharedBehaviourInstance = new UploadPdfShared({
      app: 'accept',
      component: 'acceptance',
      sendReceipt: false,
      sortSections: false,
      notifyPersonalisations: {
        'loan reference': req.sessionModel.get('loanReference')
      }
    });

    const locals = Object.assign({}, this.pdfLocals(req, res));

    try {
      const html = await sharedBehaviourInstance.renderHTML(req, res, locals);
      const pdfFile = await sharedBehaviourInstance.createPDF(req, html);
      await sharedBehaviourInstance.sendEmailWithAttachment(req, pdfFile);

      logger.info('ril.form.accept.submit_form.successful', loggerObj);
      return super.successHandler(req, res, next);
    } catch (err) {
      logger.error('ril.form.accept.submit_form.error', loggerObj);

      const acceptanceErrorsGauge = registry.getSingleMetric('ril_acceptance_errors_gauge');
      acceptanceErrorsGauge.inc({ component: 'acceptance-form-submission' }, 1.0);

      return next(Error('There was an error sending your loan acceptance form'));
    }
  }
};

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
      app: 'apply',
      component: 'application',
      sendReceipt: true,
      sortSections: true,
      notifyPersonalisations: {
        name: req.sessionModel.get('fullName')
      }
    });

    const locals = Object.assign({}, this.pdfLocals(req, res));

    try {
      const html = await sharedBehaviourInstance.renderHTML(req, res, locals);
      const pdfFile = await sharedBehaviourInstance.createPDF(req, html);
      await sharedBehaviourInstance.sendEmailWithAttachment(req, pdfFile);

      logger.info('ril.form.apply.submit_form.successful', loggerObj);
      return super.successHandler(req, res, next);
    } catch (err) {
      logger.error('ril.form.apply.submit_form.error', loggerObj);

      const applicationErrorsGauge = registry.getSingleMetric('ril_application_errors_gauge');
      applicationErrorsGauge.inc({ component: 'application-form-submission' }, 1.0);

      return next(Error('There was an error sending your loan application form'));
    }
  }
};

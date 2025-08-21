const config = require('../../../config');

module.exports = superclass => class extends superclass {
  locals(req, res) {
    const locals = super.locals(req, res);

    this.setContinueLink(req, res);

    return locals;
  }

  setContinueLink(req, res) {
    const refererIsInternal = referer => referer.hostname === req.hostname;

    const allowedPaths = ['accept', 'apply'];

    const refererHeader = req.headers?.referer;
    const refererUrl = refererHeader ? new URL(refererHeader) : undefined;

    if (refererUrl && refererIsInternal(refererUrl)) {
      const refererPathElements = refererUrl.pathname.split('/');

      const application = refererPathElements[1];
      const pathInAllowedPaths = application && allowedPaths.some(element => element === application);
      if (pathInAllowedPaths) {
        const stepElement = refererPathElements[2];
        const lastStep = stepElement && /^[a-zA-Z0-9-_]+$/.test(stepElement) ? `/${stepElement}` : '';

        req.sessionModel.set('continueLink', `/${application}${lastStep}`);
      }
    } else {
      req.sessionModel.set('continueLink', config.govukLandingPageUrl.href);
    }
    res.locals.continueLink = req.sessionModel.get('continueLink');
  }
};

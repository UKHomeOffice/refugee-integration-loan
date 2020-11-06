'use strict';

module.exports = superclass => class extends superclass {
  getValues(req, res, next) {
    req.sessionModel.unset([
      'feedbackName',
      'feedbackEmail',
      'feedbackProcess',
      'feedbackPath',
      'feedbackText'
    ]);

    return super.getValues(req, res, next);
  }
  successHandler(req, res) {
    const referer = req.sessionModel.get('feedbackReferer') || `${req.get('origin')}/apply`;

    req.sessionModel.unset('feedbackReferer');

    return res.redirect(referer);
  }
};

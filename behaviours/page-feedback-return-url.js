'use strict';

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    const feedbackUrl = res.locals.feedbackUrl || "/feedback";
    if(req.path !== feedbackUrl) {
      req.sessionModel.set('feedbackReturnPath', req.path);
    }
    return Object.assign(super.locals(req, res), {'feedbackUrl': req.baseUrl + feedbackUrl})
  }
};

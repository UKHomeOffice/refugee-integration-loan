'use strict';

const _ = require('lodash');
const config = require('../../../config');
const utilities = require('../../../lib/utilities');
const capitalize = utilities.capitalize;
const NotifyClient = utilities.NotifyClient;

module.exports = superclass => class extends superclass {

  getValues(req, res, next) {
    const referer = _.get(req, 'headers.referer') || `${req.get('origin')}/apply`;
    const url = new URL(referer);
    const refs = url.pathname.match(/^\/([\w-_.+!*'(),$]+)\/(.*)$/);
    const redirectApp = _.get(refs, '[1]');
    const notRedirectedFromFeedbackPage = redirectApp !== 'feedback';

    if (redirectApp && notRedirectedFromFeedbackPage) {
      req.sessionModel.set('feedbackReferer', url);
      req.sessionModel.set('feedbackProcess', capitalize(refs[1]));
      req.sessionModel.set('feedbackPath', `'${refs[2]}'`);
    }

    return super.getValues(req, res, next);
  }

  async successHandler(req, res, next) {
    const templateId = config.govukNotify.templateFormFeedback;
    const emailAddress = config.govukNotify.feedbackEmail;
    const notifyClient = new NotifyClient(config.govukNotify.notifyApiKey);

    const name = req.sessionModel.get('feedbackName');
    const email = req.sessionModel.get('feedbackEmail');
    const process = req.sessionModel.get('feedbackProcess') || 'Feedback';
    const path = req.sessionModel.get('feedbackPath') || '\'feedback\'';
    const feedback = req.sessionModel.get('feedbackText');

    try {
      await notifyClient.sendEmail(templateId, emailAddress, {
        personalisation: {
          name,
          email,
          nameExists: name ? 'yes' : 'no',
          emailExists: email ? 'yes' : 'no',
          process,
          path,
          feedback
        }
      });

      req.log('info', 'ril.form.feedback.submit_form.successful');

      return super.successHandler(req, res, next);
    } catch (err) {
      req.log('error', 'ril.form.feedback.submit_form.error', err.message || err);
      return next(err);
    }
  }
};

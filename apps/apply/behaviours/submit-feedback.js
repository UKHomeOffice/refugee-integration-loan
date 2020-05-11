/* eslint-disable no-underscore-dangle */

'use strict';
const config = require('../../../config');

const feedbackEmail = config.govukNotify.feedbackEmail;
const templateId = config.govukNotify.templateFormFeedback;
const notifyApiKey = config.govukNotify.notifyApiKey;
const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(notifyApiKey);

module.exports = superclass => class extends superclass {

  constructor(options) {
    super(options);
  }

  process(req, res, next) {
    notifyClient.sendEmail(templateId, feedbackEmail, {
        personalisation: {
          'process': req.baseUrl,
          'path': req.sessionModel.get('feedbackReturnPath'),
          'feedback': req.form.values['feedbackText'],
          'name': req.form.values['feedbackName'],
          'email': req.form.values['feedbackEmail']
        }
    })
    .then(response => req.log('info', 'EMAIL: OK ' + response.body)).catch(err => req.log('info', 'EMAIL: ERROR ' + err))
    .then(() => {
        super.process(req, res, next);
    }, next)
    .catch((err) => {
      next(err);
    });
  }

  saveValues(req, res, callback) {
    //do nothing, we don't want to save them
    return callback();
  }

  getNextStep(req, res) {
    const feedbackReturnPath = req.sessionModel.get('feedbackReturnPath');
    if (feedbackReturnPath) {
      return req.baseUrl+feedbackReturnPath;
    }
    return super.getNextStep(req, res);
  }

  getNext(req, res) {
    return req.form.options.next;
  }

};
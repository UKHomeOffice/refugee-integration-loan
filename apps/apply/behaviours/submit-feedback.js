/* eslint-disable no-underscore-dangle */

'use strict';
const config = require('../../../config');
const _ = require('lodash');

const feedbackEmail = config.govukNotify.feedbackEmail;
const templateId = config.govukNotify.templateFormFeedback;
const notifyApiKey = config.govukNotify.notifyApiKey;
const NotifyClient = require('notifications-node-client').NotifyClient;
const notifyClient = new NotifyClient(notifyApiKey);

module.exports = superclass => class extends superclass {

  constructor(options) {
    super(options);
  }

  addOptional(target, property, value) {
    if(property && value) {
      return Object.assign(target, this.singleItemJson(property, value));
    }
  }

  singleItemJson(property, value) {
    let json = {};
    json[property] = value;
    return json;
  }

  process(req, res, next) {
    const feedbackEmailConfig = req.form.options.feedbackEmailConfig;
    let templateValues = {};
    if(feedbackEmailConfig) {
      templateValues = this.addOptional(templateValues, feedbackEmailConfig.includeBaseUrlAs, req.baseUrl);
      templateValues = this.addOptional(templateValues, feedbackEmailConfig.includeSourcePathAs, req.sessionModel.get('feedbackReturnPath'));
      templateValues = _.reduce(
        _.map(feedbackEmailConfig.fieldMappings, (property, formField) => this.singleItemJson(property, req.form.values[formField])),
        _.assign,
        templateValues
      );
    }
    notifyClient.sendEmail(templateId, feedbackEmail, {
        personalisation: templateValues
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
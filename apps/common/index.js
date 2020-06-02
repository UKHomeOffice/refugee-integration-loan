'use strict';

const UploadFeedback = require('hof-behaviour-feedback').SubmitFeedback;
const config = require('../../config');

module.exports = {
  name: 'common',
  steps: {
    '/accessibility': {
    },
    '/feedback': {
      fields: ['feedbackText', 'feedbackName', 'feedbackEmail'],
      behaviours: [UploadFeedback],
      feedbackConfig: {
        notify: {
          apiKey: config.govukNotify.notifyApiKey,
          email: {
            templateId: config.govukNotify.templateFormFeedback,
            emailAddress: config.govukNotify.feedbackEmail,
            fieldMappings: {
                feedbackText: 'feedback',
                feedbackName: 'name',
                feedbackEmail: ' email'
            },
            includeBaseUrlAs: 'process',
            includeSourcePathAs: 'path'
          }
        }
      }
    }
  }
};

'use strict';

const logger = require('./logger');
const config = require('../config');

/**
 * Mock Notification Client
 */
class NotifyMock {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  sendEmail(templateId, emailAddress, options) {
    logger.info(`Using mock sendEmail with templateId: ${templateId},
       emailAddress: ${emailAddress}, options: ${options}`);

    return Promise.resolve({});
  }

  prepareUpload() {
    logger.info('Using mock prepareUpload');
  }
}

exports.NotifyClient = config.govukNotify.notifyApiKey === 'USE-MOCK' ? NotifyMock
    : require('notifications-node-client').NotifyClient;

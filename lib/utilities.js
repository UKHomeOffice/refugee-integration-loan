'use strict';

const logger = require('../lib/logger');

/**
 * Do nothing notification client
 */
class NotifyMock {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }


  sendEmail(templateId, emailAddress, options) {
    // eslint-disable-next-line no-console
    logger.info(`Using mock sendEmail with templateId: ${templateId}, 
       emailAddress: ${emailAddress}, options: ${options}`);

    return Promise.resolve({});
  }

  prepareUpload() {
    // eslint-disable-next-line no-console
    logger.info('Using mock prepareUpload');
  }
}


// eslint-disable-next-line no-process-env
exports.NotifyClient = process.env.NOTIFY_KEY === 'USE-MOCK' ? NotifyMock
    : require('notifications-node-client').NotifyClient;

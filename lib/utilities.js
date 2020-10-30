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

  sendSms(templateId, phoneNumber, options) {
    logger.info(`Using mock sendSms with templateId: ${templateId},
       phoneNumber: ${phoneNumber}, options: ${options}`);

    return Promise.resolve({});
  }

  prepareUpload() {
    logger.info('Using mock prepareUpload');
  }
}

let secondsBetween = (startDate, endDate) => {
  const dif = endDate - startDate;
  const secondsFromStartToEnd = dif / 1000;
  return Math.abs(secondsFromStartToEnd);
};

module.exports = {
  secondsBetween,
  NotifyClient: config.govukNotify.notifyApiKey === 'USE-MOCK' ?
    NotifyMock : require('notifications-node-client').NotifyClient
};

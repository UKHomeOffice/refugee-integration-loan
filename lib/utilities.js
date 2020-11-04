'use strict';

const config = require('../config');

/**
 * Mock Notification Client
 */
class NotifyMock {
  constructor(apiKey, logger) {
    this.apiKey = apiKey;
    this.logger = logger;
  }

  sendEmail(templateId, emailAddress, options) {
    this.logger('info', `Using mock sendEmail with templateId: ${templateId},
       emailAddress: ${emailAddress}, options: ${options}`);

    return Promise.resolve({});
  }

  sendSms(templateId, phoneNumber, options) {
    this.logger('info', `Using mock sendSms with templateId: ${templateId},
       phoneNumber: ${phoneNumber}, options: ${options}`);

    return Promise.resolve({});
  }

  prepareUpload() {
    this.logger('info', 'Using mock prepareUpload');
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

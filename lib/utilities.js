/* eslint-disable no-console */
'use strict';

const config = require('../config');

class NotifyMock {
  sendEmail() {
    return Promise.resolve();
  }

  sendSms() {
    return Promise.resolve();
  }

  prepareUpload() {}
}

let secondsBetween = (startDate, endDate) => {
  const dif = endDate - startDate;
  const secondsFromStartToEnd = dif / 1000;
  return Math.abs(secondsFromStartToEnd);
};

let capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = {
  capitalize,
  secondsBetween,
  NotifyClient: config.govukNotify.notifyApiKey === 'USE-MOCK' ?
    NotifyMock : require('notifications-node-client').NotifyClient
};

/* eslint-disable no-console */


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

const secondsBetween = (startDate, endDate) => {
  const dif = endDate - startDate;
  const secondsFromStartToEnd = dif / 1000;
  return Math.abs(secondsFromStartToEnd);
};

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = {
  capitalize,
  secondsBetween,
  NotifyClient: config.govukNotify.notifyApiKey === 'USE_MOCK' ?
    NotifyMock : require('notifications-node-client').NotifyClient
};


const setDateErrorLink = require('../common/behaviours/set-date-error-link');
const Summary = require('hof').components.summary;
const UploadPDF = require('./behaviours/upload-pdf');
const config = require('../../config');

const confirmStep = config.routes.confirmStep;

module.exports = {
  name: 'accept',
  baseUrl: '/accept',
  steps: {
    '/reference-number': {
      fields: ['loanReference'],
      next: '/your-details'
    },
    '/your-details': {
      fields: ['name', 'dateOfBirth'],
      behaviours: [setDateErrorLink],
      next: '/contact'
    },
    '/contact': {
      fields: ['contactTypes', 'email', 'phone'],
      next: '/confirm'
    },
    [confirmStep]: {
      behaviours: [Summary, UploadPDF],
      sections: require('./sections/summary-data-sections'),
      next: '/complete-acceptance'
    },
    '/complete-acceptance': {
      clearSession: true
    }
  }
};

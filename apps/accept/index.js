
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
      next: '/brp'
    },
    '/brp': {
      fields: ['brpNumber', 'dateOfBirth'],
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
      pdfSections: require('./sections/summary-data-sections'),
      uploadPdfShared: false,
      submitted: false,
      next: '/complete-acceptance'
    },
    '/complete-acceptance': {
      clearSession: true
    }
  }
};

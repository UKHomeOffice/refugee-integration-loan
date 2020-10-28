'use strict';

const UploadPDF = require('./behaviours/upload-pdf');
const LoopSummary = require('hof-behaviour-loop').SummaryWithLoopItems;
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
      next: '/confirm'
    },
    [confirmStep]: {
      behaviours: [LoopSummary, UploadPDF],
      pdfSections: require('./sections/pdf-data-sections'),
      uploadPdfShared: false,
      submitted: false,
      next: '/complete-acceptance'
    },
    '/complete-acceptance': {
      clearSession: true
    }
  }
};

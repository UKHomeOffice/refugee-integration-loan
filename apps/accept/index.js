'use strict';

const UploadPDF = require('./behaviours/upload-pdf');
const LoopSummary = require('hof-behaviour-loop').SummaryWithLoopItems;

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
     '/confirm': {
       behaviours: ['complete', LoopSummary, UploadPDF],
       pdfSections: require('./sections/pdf-data-sections'),
       next: '/complete-acceptance'
     },
     '/complete-acceptance': {}
  }
};

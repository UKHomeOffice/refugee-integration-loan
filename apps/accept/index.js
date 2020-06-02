'use strict';

const UploadPDF = require('./behaviours/upload-pdf');

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
       behaviours: ['complete', UploadPDF],
       next: '/complete'
     },
     '/complete': {
     }
  }
};

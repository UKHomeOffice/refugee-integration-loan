'use strict';

const UploadPDF = require('./behaviours/upload-pdf');
const UploadFeedback = require('./behaviours/submit-feedback')

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
     },
     '/feedback': {
       fields: ['feedbackText', 'feedbackName', 'feedbackEmail'],
       behaviours: [UploadFeedback]
     }
  }
}
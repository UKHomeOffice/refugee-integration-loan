'use strict';

const UploadPDF = require('./behaviours/upload-pdf');
const UploadFeedback = require('hof-behaviour-feedback').SubmitFeedback
const config = require('../../config')

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
}
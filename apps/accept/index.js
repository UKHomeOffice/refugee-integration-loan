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
     },
     '/feedback': {
       fields: ['feedbackText', 'feedbackName', 'feedbackEmail'],
       behaviours: [UploadFeedback],
       feedbackConfig: {
         notify: {
           apiKey: config.govukNotify.notifyApiKey,
           email: {
             templateId: config.govukNotify.templateFormFeedback,
             emailAddress: config.govukNotify.feedbackEmail,
             fieldMappings: {
                 'feedbackText': 'feedback',
                 'feedbackName' : 'name',
                 'feedbackEmail' : ' email'
             },
             includeBaseUrlAs : "process",
             includeSourcePathAs : "path"
           }
         }
       }
     }
  }
}
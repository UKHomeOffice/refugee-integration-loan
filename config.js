'use strict';

/* eslint no-process-env: 0 */

module.exports = {
  DATE_FORMAT: 'YYYY-MM-DD',
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:mm:ss',
  pdf: {
    tempLocation: 'pdf-form-submissions'
  },
  govukNotify: {
    notifyApiKey: process.env.NOTIFY_KEY,
    caseworkerEmail: process.env.CASEWORKER_EMAIL,
    feedbackEmail: process.env.FEEDBACK_EMAIL,
    templateFormApply: process.env.TEMPLATE_APPLY,
    templateFormAccept: process.env.TEMPLATE_ACCEPT,
    templateFormFeedback: process.env.TEMPLATE_FEEDBACK,
    templateEmailReceipt: process.env.TEMPLATE_EMAIL_RECEIPT,
    templateTextReceipt: process.env.TEMPLATE_TEXT_RECEIPT
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  hofLogLevel: process.env.HOF_LOG_LEVEL || 'warn'
};

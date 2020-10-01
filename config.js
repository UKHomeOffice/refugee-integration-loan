'use strict';

/* eslint no-process-env: 0 */

module.exports = {
  DATE_FORMAT: 'YYYY-MM-DD',
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:MM:SS ZZ',
  redis: {
    password: process.env.REDIS_PASSWORD
  },
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
  keycloak: {
    tokenUrl: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET
  }
};

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
    notifyApiKey: process.env.NOTIFY_KEY || 'NOTIFY-KEY-NOT-SET',
    caseworkerEmail: process.env.CASEWORKER_EMAIL || 'colab@digital.homeoffice.gov.uk',
    feedbackEmail: process.env.FEEDBACK_EMAIL || 'colab@digital.homeoffice.gov.uk',
    templateFormApply: process.env.TEMPLATE_APPLY || '1376a8f2-2157-42f3-b9a7-5008ba8f26c9',
    templateFormAccept: process.env.TEMPLATE_ACCEPT || '21235643-6a96-426a-94d5-bc1a49c0b1d0',
    templateFormFeedback: process.env.TEMPLATE_FEEDBACK || 'ccfb0d84-8bed-4749-8667-c7890cd1dcb1',
    templateEmailReceipt: process.env.TEMPLATE_EMAIL_RECEIPT || '428f308d-228b-4b3f-a866-e389d122a212',
    templateTextReceipt: process.env.TEMPLATE_TEXT_RECEIPT || '03db3bde-be6c-4f54-888d-2c0bc0d76bca'
  },
  keycloak: {
    tokenUrl: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET
  }
};

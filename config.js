/* eslint no-process-env: 0 */


module.exports = {
  nodeEnv: process.env.NODE_ENV,
  DATE_FORMAT: 'YYYY-MM-DD',
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:mm:ss',
  pdf: {
    tempLocation: 'pdf-form-submissions'
  },
  hosts: {
    acceptanceTests: process.env.ACCEPTANCE_HOST_NAME || `http://localhost:${process.env.PORT || 8080}`
  },
  govukNotify: {
    notifyApiKey: process.env.NOTIFY_KEY,
    caseworkerEmail: process.env.CASEWORKER_EMAIL,
    feedbackEmail: process.env.FEEDBACK_EMAIL,
    templateForm: {
      apply: process.env.TEMPLATE_APPLY,
      accept: process.env.TEMPLATE_ACCEPT
    },
    templateFormFeedback: process.env.TEMPLATE_FEEDBACK,
    templateEmailReceipt: process.env.TEMPLATE_EMAIL_RECEIPT,
    templateTextReceipt: process.env.TEMPLATE_TEXT_RECEIPT,
    templateAcceptEmailReceipt: process.env.TEMPLATE_ACCEPT_EMAIL_RECEIPT,
    templateAcceptTextReceipt: process.env.TEMPLATE_ACCEPT_TEXT_RECEIPT
  },
  routes: {
    confirmStep: '/confirm'
  },
  govukLandingPageUrl: new URL('https://www.gov.uk/refugee-integration-loan')
};

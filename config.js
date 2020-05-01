'use strict';

/* eslint no-process-env: 0 */
const env = process.env.NODE_ENV || 'production';
const localhost = () => `${process.env.LISTEN_HOST || '0.0.0.0'}:${process.env.PORT || 8080}`;

module.exports = {
  DATE_FORMAT: 'YYYY-MM-DD',
  PRETTY_DATE_FORMAT: 'Do MMMM YYYY',
  dateTimeFormat: 'DD MMM YYYY HH:MM:SS ZZ',
  email: {
    caseworker: process.env.CASEWORKER_EMAIL || '',
    from: process.env.FROM_ADDRESS || '',
    replyTo: process.env.REPLY_TO || '',
    transport: process.env.EMAIL_TRANSPORT || 'ses',
    transportOptions: {
      accessKeyId: process.env.AWS_USER || '',
      secretAccessKey: process.env.AWS_PASSWORD || '',
      region: process.env.EMAIL_REGION || '',
      port: process.env.EMAIL_PORT || '',
      host: process.env.EMAIL_HOST || '',
      ignoreTLS: process.env.EMAIL_IGNORE_TLS || '',
      secure: process.env.EMAIL_SECURE || ''
    }
  },
  redis: {
    password: process.env.REDIS_PASSWORD
  },
  pdf: {
    tempLocation: 'pdf-form-submissions'
  },
  upload: {
    bucketName: env !== 'production' ? `test_bucket` : process.env.BUCKET,
    awsAccessKeyId: env !== 'production' ? `test_key_id` : process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: env !== 'production' ? `test_secret_key` : process.env.AWS_SECRET_ACCESS_KEY,
    kmsKey: env !== 'production' ? `test_kms_key` : process.env.KMS_KEY
  },
  govukNotify: {
    notifyApiKey: process.env.NOTIFY_KEY || '',
    caseworkerEmail: process.env.CASEWORKER_EMAIL || 'colab@digital.homeoffice.gov.uk',
    templateFormSubmission: process.env.TEMPLATE_SUBMISSION || '1376a8f2-2157-42f3-b9a7-5008ba8f26c9'
  },
  keycloak: {
    tokenUrl: process.env.KEYCLOAK_TOKEN_URL,
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET
  }
};

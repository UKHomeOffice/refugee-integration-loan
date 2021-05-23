
const moment = require('moment');
const config = require('../../../config');

module.exports = {
  'pdf-applicant-details': [
    'loanReference',
    'brpNumber',
    {
      field: 'dateOfBirth',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    }
  ],
  'pdf-contact-details': [
    'email',
    'phone'
  ]
};


const dayjs = require('dayjs');
const config = require('../../../config');

module.exports = {
  'pdf-applicant-details': [
    'loanReference',
    'name',
    {
      field: 'dateOfBirth',
      parse: d => d && dayjs(d).format(config.PRETTY_DATE_FORMAT)
    }
  ],
  'pdf-contact-details': [
    'email',
    'phone'
  ]
};

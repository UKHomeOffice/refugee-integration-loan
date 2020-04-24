'use strict';

const moment = require('moment');
const config = require('../../../config');

module.exports = {
  'dependent-details': [
    'dependentFullName',
    {
      field: 'dependentDateOfBirth',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    },
    'dependentRelationship'
  ]
};
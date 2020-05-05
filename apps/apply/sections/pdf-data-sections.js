'use strict';

const moment = require('moment');
const config = require('../../../config');

module.exports = {
  'key-details': [
    'what',
    {
      field: 'nldp-date',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    },
    'property-address',
    {
      field: 'tenancy-start',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    }
  ],
  'tenants-left': [
    'name',
    {
      field: 'date-left',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    },
    {
      field: 'date-of-birth',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    },
    'nationality',
    'reference-number'
  ],
  'landlord-details': [
    'landlord-name',
    'landlord-company',
    'landlord-email-address',
    'landlord-phone-number',
    'landlord-address',
    'landlord-name-agent'
  ],
  'agent-details': [
    'agent-company',
    'agent-name',
    'agent-email-address',
    'agent-phone-number',
    'agent-address'
  ]
};

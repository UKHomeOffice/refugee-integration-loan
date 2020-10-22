'use strict';

const dateComponent = require('hof-component-date');

const after1900Validator = { type: 'after', arguments: ['1900'] };

module.exports = {
  loanReference: {
    validate: 'required'
  },
  brpNumber: {
    validate: ['required', 'alphanum', { type: 'exactlength', arguments: 9 }],
    formatter: ['uppercase']
  },
  dateOfBirth: dateComponent('dateOfBirth', {
    validate: ['required', 'before', after1900Validator]
  })
};

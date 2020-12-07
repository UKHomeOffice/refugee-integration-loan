'use strict';

const dateComponent = require('hof-component-date');

module.exports = {
  loanReference: {
    validate: 'required'
  },
  brpNumber: {
    validate: ['required', 'alphanum', { type: 'exactlength', arguments: 9 }],
    formatter: ['uppercase']
  },
  dateOfBirth: dateComponent('dateOfBirth', {
    validate: ['required', { type: 'after', arguments: ['1900'] }, 'before', 'over18']
  }),
  contactTypes: {
    mixin: 'checkbox-group',
    options: [
      {
        value: 'email',
        toggle: 'email',
        child: 'partials/details-summary'
      },
      {
        value: 'phone',
        toggle: 'phone',
        child: 'partials/details-summary'
      }
    ],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  email: {
    validate: ['required', 'email'],
    dependent: {
      field: 'contactTypes',
      value: 'email'
    }
  },
  phone: {
    validate: ['required', 'internationalPhoneNumber'],
    dependent: {
      field: 'contactTypes',
      value: 'phone'
    }
  }
};

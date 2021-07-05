
const dateComponent = require('hof').components.date;

const brpNumber = {
  type: 'regex',
  arguments: /(?=(?:.){10})[a-zA-Z]{2,3}?\d{7,8}$/
};

module.exports = {
  loanReference: {
    validate: 'required'
  },
  brpNumber: {
    validate: ['required', brpNumber],
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

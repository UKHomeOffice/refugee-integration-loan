
const dateComponent = require('hof').components.date;

module.exports = {
  loanReference: {
    validate: ['required', 'numeric', {type: 'minlength', arguments: [5]}, {type: 'maxlength', arguments: [5]}]
  },
  name: {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 200 }]
  },
  dateOfBirth: dateComponent('dateOfBirth', {
    mixin: 'input-date',
    validate: ['required', { type: 'after', arguments: ['1900'] }, 'before', 'over18'],
    autocomplete: 'bday'
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
    },
    autocomplete: 'email'
  },
  phone: {
    className: ['govuk-input', 'govuk-input--width-20'],
    validate: ['required', 'notUrl'],
    dependent: {
      field: 'contactTypes',
      value: 'phone'
    },
    autocomplete: 'tel'
  }
};

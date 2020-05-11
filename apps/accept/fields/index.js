'use strict';

const dateComponent = require('hof-component-date');

function brpNumber(str) {
    return regex(stripSpaces(str.toUpperCase()), /^[A-Z0-9]{9}$/)
}

function regex(value, match) {
    return typeof value === 'string' && !!value.match(match)
}

function stripSpaces(str) {
    return str.split(' ').join('')
}

module.exports = {
  loanReference: {
    validate: 'required'
  },
  brpNumber: {
   validate: ['required', brpNumber]
  },
  dateOfBirth: dateComponent('dateOfBirth', {
    validate: ['required', 'before']
  }),
  feedbackText: {
    mixin: 'textarea',
    omitFromSummary: true,
    validate: 'required'
  },
  feedbackName: {
    mixin: 'input-text',
    omitFromSummary: true
  },
  feedbackEmail: {
    mixin: 'input-text',
    omitFromSummary: true
  }
}
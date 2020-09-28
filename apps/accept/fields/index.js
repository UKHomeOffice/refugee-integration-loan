'use strict';

const dateComponent = require('hof-component-date');

function regex(value, match) {
    return typeof value === 'string' && !!value.match(match);
}

function stripSpaces(str) {
    return str.split(' ').join('');
}

function brpNumber(str) {
    return regex(stripSpaces(str.toUpperCase()), /^[A-Z0-9]{9}$/);
}

module.exports = {
  loanReference: {
    validate: 'required'
  },
  brpNumber: {
   validate: ['required', brpNumber],
   formatter: ['trim', 'spaces']
  },
  dateOfBirth: dateComponent('dateOfBirth', {
    validate: ['required', 'before']
  })
};

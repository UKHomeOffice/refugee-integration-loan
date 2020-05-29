'use strict';

function emailAddress(value) {
  return value && value.trim() !== '' ? regex(value, /^[\w-\.\+]+@([\w-]+\.)+[\w-]+$/) : true;
}

function regex(value, match) {
    return typeof value === 'string' && !!value.match(match);
}

module.exports = {
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
    omitFromSummary: true,
    validate: [emailAddress]
  }
}
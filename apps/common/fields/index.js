'use strict';

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
    validate: ['email']
  }
};

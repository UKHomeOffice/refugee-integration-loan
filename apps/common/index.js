'use strict';

const Feedback = require('./behaviours/feedback');
const FeedbackSubmitted = require('./behaviours/feedback-submitted');

module.exports = {
  name: 'common',
  steps: {
    '/accessibility': {
    },
    '/feedback': {
      fields: ['feedbackText', 'feedbackName', 'feedbackEmail'],
      behaviours: [Feedback],
      next: '/feedback-submitted'
    },
    '/feedback-submitted': {
      behaviours: [FeedbackSubmitted]
    }
  }
};


const SetContinueLink = require('./behaviours/set-continue-link');
const Feedback = require('./behaviours/feedback');
const FeedbackSubmitted = require('./behaviours/feedback-submitted');

module.exports = {
  name: 'common',
  steps: {
    '/accessibility': {
      behaviours: [SetContinueLink]
    },
    '/cookies': {
      behaviours: [SetContinueLink]
    },
    '/terms-and-conditions': {
      behaviours: [SetContinueLink]
    },
    '/feedback': {
      fields: ['feedbackText', 'feedbackName', 'feedbackEmail'],
      behaviours: [Feedback],
      next: '/feedback-submitted'
    },
    '/feedback-submitted': {
      behaviours: [FeedbackSubmitted]
    },
    '/improve-our-services': {
      behaviours: [SetContinueLink]
    },
    '/exit': {}
  }
};

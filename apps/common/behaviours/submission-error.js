'use strict';
const errors = require('../translations/src/en/errors.json');

module.exports = class SubmissionError extends Error {
  constructor(key, options) {
    super();
    options = Object.assign({
      type: 'default',
      arguments: []
    }, options);
    this.key = key;
    this.type = options.type;
    this.message = options.message;

    // Set the data from the translations fields to display in the template
    Object.keys(errors[options.type]).forEach((el) => {
      this[el] = errors[options.type][el];
    });
  }
};

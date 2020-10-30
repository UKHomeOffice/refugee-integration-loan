'use strict';

module.exports = class SubmissionError extends Error {
  constructor(key, options) {
    super();
    options = Object.assign({
      type: 'default'
    }, options);
    this.key = key;
    this.type = options.type;
    this.message = options.message;
    this.translations = options.translations;

    // Set the data from the translations fields to display in the template
    if (options.translations[options.type]) {
      Object.keys(options.translations[options.type]).forEach((el) => {
        this[el] = options.translations[options.type][el];
      });
    } else {
      Object.keys(options.translations.default).forEach((el) => {
        this[el] = options.translations.default[el];
      });
    }
  }
};

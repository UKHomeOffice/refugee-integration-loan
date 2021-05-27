'use strict';

module.exports = superclass => class SetDateErrorLink extends superclass {
  errorHandler(err, req, res, next) {
    const errFields = Object.keys(err);

    errFields.forEach(field => {
      if (field.includes('dateOfBirth') || field.includes('DateOfBirth')) {
        err[field].dobKey = `${err[field].key}-day`;
      }
    });
    return super.errorHandler(err, req, res, next);
  }
};

'use strict';

module.exports = superclass => class extends superclass {
  getNextStep(req, res) {
    this.confirmStep = '/declaration';
    return super.getNextStep(req, res);
  }
};
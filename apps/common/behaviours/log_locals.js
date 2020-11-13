'use strict';

module.exports = superclass => class extends superclass {

  locals(req, res) {
    const locals = super.locals(req, res);
    console.log(JSON.stringify(locals));
    return locals;

  }
};

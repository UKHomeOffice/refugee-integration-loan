'use strict';

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    req.log('info', 'analytics:' + req.sessionID + '^' + req.path);
    return super.locals(req, res);
  }
};

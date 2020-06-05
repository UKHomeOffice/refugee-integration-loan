'use strict';

const client = require('prom-client');
const registry = client.register;

const startApplyFormCounter = registry.getSingleMetric('start_apply_form');
const submitApplyFormCounter = registry.getSingleMetric('submit_apply_form');

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    req.log('info', 'analytics:' + req.sessionID + '^' + req.path);
    if (req.originalUrl.includes('apply/previously-applied')) {
      startApplyFormCounter.inc();
    }

    if (req.originalUrl.includes('apply/confirm')) {
      submitApplyFormCounter.inc();
    }
    return super.locals(req, res);
  }
};

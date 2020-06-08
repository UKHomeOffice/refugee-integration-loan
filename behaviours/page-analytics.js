'use strict';

const client = require('prom-client');
const registry = client.register;

const pageHitCounter = registry.getSingleMetric('ril_page_hit_count');

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    req.log('info', 'analytics:' + req.sessionID + '^' + req.path);
    pageHitCounter.inc({ page: req.path });
    return super.locals(req, res);
  }
};

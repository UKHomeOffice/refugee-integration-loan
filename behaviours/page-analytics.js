'use strict';

const client = require('prom-client');
const registry = client.register;

const pageHitCounter = registry.getSingleMetric('ril_page_hit_count');
const pageHitGauge = registry.getSingleMetric('ril_page_hit_gauge');

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    req.log('info', 'analytics:' + req.sessionID + '^' + req.path);
    pageHitCounter.inc({ page: req.path }, 1.0);
    pageHitGauge.inc({ page: req.path }, 1.0);
    return super.locals(req, res);
  }
};

'use strict';

const client = require('prom-client');
const registry = client.register;
const pageHitGauge = registry.getSingleMetric('ril_page_hit_gauge');
const visitorGauge = registry.getSingleMetric('ril_visitor_gauge');

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    req.log('info', 'analytics:' + req.sessionID + '^' + req.path);
    pageHitGauge.inc({ page: req.path }, 1.0);
    visitorGauge.inc({ user: req.sessionID, page: req.path }, 1.0);
    return super.locals(req, res);
  }
};

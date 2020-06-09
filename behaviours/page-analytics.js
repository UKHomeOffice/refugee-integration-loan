'use strict';

const client = require('prom-client');
const registry = client.register;
const pageHitGauge = registry.getSingleMetric('ril_page_hit_gauge');
const visitorGauge = registry.getSingleMetric('ril_visitor_gauge');
const visitorDeviceGauge = registry.getSingleMetric('ril_visitor_device_gauge');

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    pageHitGauge.inc({ page: req.path }, 1.0);
    visitorGauge.inc({ user: req.sessionID, page: req.path }, 1.0);
    if (req.path.includes('reference-number') || req.path.includes('previously-applied')) {
      visitorDeviceGauge.inc({ device: req.headers['user-agent'] }, 1.0);
    }
    return super.locals(req, res);
  }
};

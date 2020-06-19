/*
 * This file provides readiness and liveness checks for use with Kubernetes.
 * For information on how to set them up, look at the Kubernetes documentation:
 *
 * https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
 *
 */
'use strict';

const router = require('express').Router();
const client = require('prom-client');
const registry = new client.Registry();

const pageHitGauge = new client.Gauge({
  name: 'ril_page_hit_gauge',
  help: 'ril_page_hit_gauge Page hits for all service forms',
  labelNames: ['page'],
});

const visitorGauge = new client.Gauge({
  name: 'ril_visitor_gauge',
  help: 'ril_visitor_gauge Visitors for all service forms',
  labelNames: ['user', 'page', 'duration'],
});

const visitorDeviceGauge = new client.Gauge({
  name: 'ril_visitor_device_gauge',
  help: 'ril_visitor_device_gauge User Agent data',
  labelNames: ['device'],
});

const applicationErrorGauge = new client.Gauge({
  name: 'ril_application_errors_gauge',
  help: 'ril_application_errors_gauge Errors caught in the application scope',
  labelNames: ['component'],
});

const applicationSubmissionHistogram = new client.Histogram({
  name: 'ril_application_page_duration_histogram',
  help: 'ril_application_page_duration_histogram measures user journey application submission durations',
  labelNames: ['page'],
  buckets: [1, 5, 15, 20, 40, 60, 80, 100, 120, 140, 160, 180]
});

const applicationSubmissionSummary = new client.Histogram({
  name: 'ril_application_page_duration_summary',
  help: 'ril_application_page_duration_summary measures user journey application submission durations',
  labelNames: ['page'],
  buckets: [1, 5, 15, 20, 40, 60, 80, 100, 120, 140, 160, 180]
});

registry.registerMetric(pageHitGauge);
registry.registerMetric(visitorGauge);
registry.registerMetric(visitorDeviceGauge);
registry.registerMetric(applicationErrorGauge);
registry.registerMetric(applicationSubmissionHistogram);
registry.registerMetric(applicationSubmissionSummary);

module.exports = () => {
  router.get('/metrics', (req, res) => {
    res.set('Content-Type', registry.contentType);
    res.end(registry.metrics());
  });

  return router;
};

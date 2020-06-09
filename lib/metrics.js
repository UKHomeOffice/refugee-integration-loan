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

const pageHitCounter = new client.Counter({
  name: 'ril_page_hit_count',
  help: 'ril_page_hit_count Page hits for all service forms',
  labelNames: ['page'],
});

const pageHitGauge = new client.Gauge({
  name: 'ril_page_hit_gauge',
  help: 'ril_page_hit_gauge Page hits for all service forms',
  labelNames: ['page'],
});

registry.registerMetric(pageHitCounter);
registry.registerMetric(pageHitGauge);

module.exports = () => {
  router.get('/metrics', (req, res) => {
    res.set('Content-Type', registry.contentType);
    res.end(registry.metrics());
  });

  return router;
};

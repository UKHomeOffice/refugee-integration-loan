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

const startApplyCounter = new client.Counter({
  name: 'start_apply_form',
  help: 'start_apply_form_help',
});

const submitApplyCounter = new client.Counter({
  name: 'submit_apply_form',
  help: 'submit_apply_form_help',
});

exports.StartApplyCounter = startApplyCounter;
exports.SubmitApplyCounter = submitApplyCounter;

registry.registerMetric(startApplyCounter);
registry.registerMetric(submitApplyCounter);

module.exports = () => {
  router.get('/metrics', (req, res) => {
    res.set('Content-Type', registry.contentType);
    res.end(registry.metrics());
  });

  return router;
};

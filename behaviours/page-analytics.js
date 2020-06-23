'use strict';

const client = require('prom-client');
const registry = client.register;
const pageHitGauge = registry.getSingleMetric('ril_page_hit_gauge');
const visitorGauge = registry.getSingleMetric('ril_visitor_gauge');
const visitorDeviceGauge = registry.getSingleMetric('ril_visitor_device_gauge');
const pageDurationHistogram = registry.getSingleMetric('ril_application_page_duration_histogram');
const pageDurationSummary = registry.getSingleMetric('ril_application_page_duration_summary');
const pageDurationGauge = registry.getSingleMetric('ril_page_duration_gauge');

// var logger = require('../../lib/logger');
// Store a a fastest and slowest duration (time-on-page) for each page
// Store the average duration for each page
// Log pages and their fastest and slowest on every request
// Log pages average duration on every request

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    req.log('info', 'user-id=' + req.sessionID + ' page=' + req.path);
    pageHitGauge.inc({ page: req.path }, 1.0);
    if (req.path.includes('reference-number') || req.path.includes('previously-applied')) {
      visitorDeviceGauge.inc({ device: req.headers['user-agent'] }, 1.0);
      req.sessionModel.set('session.started.timestamp', Date.now());
      var formName = req.path.includes('previously-applied') ? 'apply' : 'accept';
      req.log('info', 'ril.form.' + formName + '.started');
    } else if (req.path.indexOf('index') === -1) {
      var trackedPageStartTime = Number(req.sessionModel.get('ril.tracker.milliseconds'));
      var trackedPage = req.sessionModel.get('ril.tracker.page');
      var timeSpentOnPage = this.secondsSince(trackedPageStartTime);
      req.log('info', 'metrics page [' + trackedPage + '] duration [' + timeSpentOnPage + '] seconds');

      pageDurationHistogram.labels(trackedPage).observe(timeSpentOnPage);
      pageDurationSummary.labels(trackedPage).observe(timeSpentOnPage);
      visitorGauge.inc({ user: req.sessionID, page: trackedPage, duration: timeSpentOnPage }, 1.0);
      pageDurationGauge.set({page: trackedPage }, timeSpentOnPage);
    }
    req.sessionModel.set('ril.tracker.page', req.path);
    req.sessionModel.set('ril.tracker.milliseconds', Date.now());
    return super.locals(req, res);
  }

  secondsSince(startDate) {
    var now = new Date();
    var dif = now - startDate;
    var secondsFromStartToNow = dif / 1000;
    return Math.abs(secondsFromStartToNow);
  }
};

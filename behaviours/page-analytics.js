'use strict';

const client = require('prom-client');
const registry = client.register;
const pageHitGauge = registry.getSingleMetric('ril_page_hit_gauge');
const visitorGauge = registry.getSingleMetric('ril_visitor_gauge');
const visitorDeviceGauge = registry.getSingleMetric('ril_visitor_device_gauge');
const pageDurationHistogram = registry.getSingleMetric('ril_application_page_duration_histogram');
const pageDurationSummary = registry.getSingleMetric('ril_application_page_duration_summary');
// var logger = require('../../lib/logger');

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    req.log('info', 'user-id=' + req.sessionID + ' page=' + req.path);
    var date = new Date();
    var timestamp = date.getTime();
    var startMilliseconds = Number(req.cookies['session.started.at.cookie']);
    var startDate = new Date(startMilliseconds);
    req.log('info', 'XXXX startDate [' + startDate + ']');
    req.log('info', 'XXXX Form Duration [' + this.secondsSince(startDate) + '] seconds');
    pageHitGauge.inc({ page: req.path }, 1.0);
    if (req.path.includes('reference-number') || req.path.includes('previously-applied')) {
      visitorDeviceGauge.inc({ device: req.headers['user-agent'] }, 1.0);
      // req.sessionModel.set('sessionStartedAtModel', Date.now());
      res.cookie('session.started.at.cookie', timestamp, { httpOnly: true, secure: true });
    } else if (req.path.indexOf('index') === -1) {
      var trackedPageStartTime = Number(req.cookies['ril.tracker.milliseconds']);
      var trackedPage = req.cookies['ril.tracker.page'];
      var timeSpentOnPage = this.secondsSince(trackedPageStartTime);
      pageDurationHistogram.labels(trackedPage).observe(timeSpentOnPage);
      pageDurationSummary.labels(trackedPage).observe(timeSpentOnPage);
      visitorGauge.inc({ user: req.sessionID, page: trackedPage, duration: timeSpentOnPage }, 1.0);
    }
    res.cookie('ril.tracker.page', req.path, { httpOnly: true, secure: true });
    res.cookie('ril.tracker.milliseconds', timestamp, { httpOnly: true, secure: true });
    return super.locals(req, res);
  }

  secondsSince(startDate) {
    var now = new Date();
    var dif = now - startDate;
    var secondsFromStartToNow = dif / 1000;
    return Math.abs(secondsFromStartToNow);
  }
};

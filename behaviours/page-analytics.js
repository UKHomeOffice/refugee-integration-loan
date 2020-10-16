'use strict';

const client = require('prom-client');
const registry = client.register;
const pageHitGauge = registry.getSingleMetric('ril_page_hit_gauge');
const visitorGauge = registry.getSingleMetric('ril_visitor_gauge');
const visitorDeviceGauge = registry.getSingleMetric('ril_visitor_device_gauge');
const pageDurationHistogram = registry.getSingleMetric('ril_application_page_duration_histogram');
const pageDurationSummary = registry.getSingleMetric('ril_application_page_duration_summary');
const pageDurationGauge = registry.getSingleMetric('ril_page_duration_gauge');

const logger = require('../lib/logger');
const DateUtilities = require('../lib/date-utilities');

// Store a a fastest and slowest duration (time-on-page) for each page
// Store the average duration for each page
// Log pages and their fastest and slowest on every request
// Log pages average duration on every request

module.exports = superclass => class Behaviour extends superclass {
  locals(req, res) {
    const path = req.path;
    const sessionID = req.sessionID;
    const loggerObj = { sessionID, path };

    logger.trace('Request from: ', loggerObj);

    pageHitGauge.inc({ page: path }, 1.0);

    if (req.path.includes('reference-number') || path.includes('previously-applied')) {
      visitorDeviceGauge.inc({ device: req.headers['user-agent'] }, 1.0);

      req.sessionModel.set('session.started.timestamp', Date.now());

      const formName = path.includes('previously-applied') ? 'apply' : 'accept';

      logger.info(`ril.form.${formName}.started`, loggerObj);
    } else if (path.indexOf('index') === -1 && path.indexOf('feedback') === -1) {

      const trackedPageStartTime = Number(req.sessionModel.get('ril.tracker.milliseconds'));
      const trackedPage = req.sessionModel.get('ril.tracker.page');
      const timeSpentOnPage = DateUtilities.secondsBetween(trackedPageStartTime, new Date());

      const metricsMsg = `metrics page [${trackedPage}] duration [${timeSpentOnPage}] seconds`;
      logger.trace(metricsMsg, loggerObj);

      if (trackedPage) {
        pageDurationHistogram.labels(trackedPage).observe(timeSpentOnPage);
        pageDurationSummary.labels(trackedPage).observe(timeSpentOnPage);
        visitorGauge.inc({ user: sessionID, page: trackedPage, duration: timeSpentOnPage }, 1.0);
        pageDurationGauge.set({ page: trackedPage }, timeSpentOnPage);
      }
    }

    if (path.includes('help-reasons')) {
      logger.trace('ril.form.apply.assistance', loggerObj);
    }

    if (path.includes('feedback')) {
      logger.trace('ril.form.feedback', loggerObj);
    }

    req.sessionModel.set('ril.tracker.page', path);
    req.sessionModel.set('ril.tracker.milliseconds', Date.now());
    return super.locals(req, res);
  }
};

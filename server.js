'use strict';

const logger = require('./lib/logger');
const hof = require('hof');
const metrics = require('./lib/metrics');
const config = require('./config');

const app = hof({
  build: {
    translate: {
      shared: './apps/common/translations/src'
    }
  },
  behaviours: [
    require('./behaviours/fields-filter'),
    require('./behaviours/page-analytics'),
    require('hof-behaviour-feedback').SetFeedbackReturnUrl
  ],
  routes: [
    require('./apps/common'),
    require('./apps/apply/'),
    require('./apps/accept/')
  ],
  views: require('hof-behaviour-loop').views,
  loglevel: config.hofLogLevel
});

app.use((req, res, next) => {
  // Set HTML Language
  res.locals.htmlLang = 'en';
  res.locals.feedbackUrl = '/feedback';
  res.locals.footerSupportLinks = [
    { path: '/cookies', property: 'base.cookies' },
    { path: '/terms-and-conditions', property: 'base.terms' },
    { path: '/accessibility', property: 'base.accessibility' },
  ];
  next();
});

app.use('/insight', metrics());

if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
  app.use('/test/bootstrap-session', (req, res) => {
    const appName = req.body.appName;

    if (!req.session[`hof-wizard-${appName}`]) {
      req.session[`hof-wizard-${appName}`] = {};
    }

    Object.keys(req.body.sessionProperties || {}).forEach((key) => {
      req.session[`hof-wizard-${appName}`][key] = req.body.sessionProperties[key];
    });

    res.send('Session populate complete');
  });
}

logger.info('RIL application started');

module.exports = app;

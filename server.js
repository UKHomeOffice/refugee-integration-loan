'use strict';

const hof = require('hof');
const config = require('./config');
const _ = require('lodash');
const path = require('path');

const app = hof({
  build: {
    translate: {
      shared: './apps/common/translations/src'
    }
  },
  behaviours: [
    require('./apps/common/behaviours/clear-session'),
    require('./apps/common/behaviours/fields-filter'),
    require('hof-behaviour-feedback').SetFeedbackReturnUrl
  ],
  routes: [
    require('./apps/common'),
    require('./apps/apply/'),
    require('./apps/accept/')
  ],
  views: [path.resolve(__dirname, './apps/common/views'), require('hof-behaviour-loop').views]
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

if (config.nodeEnv === 'development' || config.nodeEnv === 'test') {
  app.use('/test/bootstrap-session', (req, res) => {
    const appName = req.body.appName;

    if (!_.get(req, 'session[`hof-wizard-${appName}`]')) {
      if (!req.session) {
        throw new Error('Redis is not running!');
      }
      req.session[`hof-wizard-${appName}`] = {};
    }

    Object.keys(req.body.sessionProperties || {}).forEach((key) => {
      req.session[`hof-wizard-${appName}`][key] = req.body.sessionProperties[key];
    });

    res.send('Session populate complete');
  });
}

module.exports = app;

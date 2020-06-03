'use strict';

const hof = require('hof');
const health = require('./lib/health');

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
  views: require('hof-behaviour-loop').views
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

app.use('/health2', health())

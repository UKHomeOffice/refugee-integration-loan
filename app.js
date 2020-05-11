'use strict';

const hof = require('hof');

const app = hof({
  behaviours: [
    require('./behaviours/fields-filter'),
    require('./behaviours/page-analytics'),
    require('./behaviours/page-feedback-return-url')
  ],
  routes: [
    require('./apps/apply/'),
    require('./apps/accept/')
  ]
});

app.use((req, res, next) => {
  // Set HTML Language
  res.locals.htmlLang = 'en';
  next();
});
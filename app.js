'use strict';

const hof = require('hof');

const app = hof({
  behaviours: [
    require('./apps/apply/behaviours/fields-filter'),
    require('./apps/apply/behaviours/page-analytics')
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
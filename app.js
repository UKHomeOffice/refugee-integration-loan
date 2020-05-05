'use strict';

const hof = require('hof');

hof({
  behaviours: [
    require('./apps/apply/behaviours/fields-filter')
  ],
  routes: [
    require('./apps/apply/'),
    require('./apps/accept/')
  ]
});
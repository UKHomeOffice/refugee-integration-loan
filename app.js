'use strict';

const hof = require('hof');

hof({
  behaviours: [
    require('./apps/asylum-forms-hof/behaviours/fields-filter')
  ],
  routes: [
    require('./apps/asylum-forms-hof/'),
    require('./apps/accept/')
  ]
});
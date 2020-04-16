'use strict';

const hof = require('hof');

const settings = require('./hof.settings');

settings.routes = settings.routes.map(route => require(route));
settings.start = false;
settings.serveStatic = true;

module.exports = hof(settings);

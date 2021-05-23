/* eslint no-process-env: 0 */


process.env.PORT = 9080;
process.env.NODE_ENV = 'test';
process.env.NOTIFY_KEY = 'UNIT_TEST';

global.chai = require('chai')
  .use(require('sinon-chai'))
  .use(require('chai-as-promised'))
  .use(require('chai-subset'));
global.should = chai.should();
global.expect = chai.expect;
global.assert = require('assert');
global.sinon = require('sinon');
global.proxyquire = require('proxyquire');
global.path = require('path');
global.config = require('../config');
global._ = require('lodash');

const utils = require('./helpers/supertest_session/supertest-utilities.js');
global.getSupertestApp = (subApp, subAppPath, pages) => utils.getSupertestApp(subApp, subAppPath, pages);

process.setMaxListeners(0);
process.stdout.setMaxListeners(0);

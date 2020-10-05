'use strict';

/* eslint-disable no-process-env */
const assert = require('assert');

describe('loglevel test', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../config')];

    // clear env variables
    process.env.LOG_LEVEL = '';
  });

  it('logleshould use the process.env.LOG_LEVEL env variable if it is present',
      () => {
        // given
        process.env.LOG_LEVEL = '<<LOG_LEVEL>>';

        // when
        const config = require('../config');

        // then
        assert.equal(config.logLevel, '<<LOG_LEVEL>>');
      });

  it('should default to info',
      () => {
        // given no logging level env vars set

        // when
        const config = require('../config');

        // then
        assert.equal(config.logLevel, 'info');
      });
});

describe('hofLogLevel test', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../config')];

    // clear env variables
    process.env.HOF_LOG_LEVEL = '';
  });

  it('should use the process.env.HOF_LOG_LEVEL env variable if it is present',
      () => {
        // given
        process.env.HOF_LOG_LEVEL = '<<LOG_LEVEL>>';

        // when
        const config = require('../config');

        // then
        assert.equal(config.hofLogLevel, '<<LOG_LEVEL>>');
      });

  it('should default to warn',
      () => {
        // given no logging level env vars set

        // when
        const config = require('../config');

        // then
        assert.equal(config.hofLogLevel, 'warn');
      });
});

/* eslint-disable no-process-env */
'use strict';

describe('All Log Tests', () => {
  const logLevel = '<<LOG_LEVEL>>';

  describe('loglevel test', () => {
    it('should default to info', () => {
      let temp = process.env.LOG_LEVEL;
      delete process.env.LOG_LEVEL;
      config = proxyquire('../config.js', {});
      assert.equal(config.logLevel, 'info');
      process.env.LOG_LEVEL = temp;
    });

    it('should use the process.env.LOG_LEVEL env variable if it is present', () => {
      process.env.LOG_LEVEL = logLevel;
      config = proxyquire('../config.js', {});

      assert.equal(config.logLevel, logLevel);
    });
  });

  describe('hofLogLevel test', () => {
    it('should default to warn', () => {
      assert.equal(config.hofLogLevel, 'warn');
    });

    it('should use the process.env.HOF_LOG_LEVEL env variable if it is present', () => {
      process.env.HOF_LOG_LEVEL = logLevel;
      config = proxyquire('../config.js', {});

      assert.equal(config.hofLogLevel, logLevel);
    });
  });

});

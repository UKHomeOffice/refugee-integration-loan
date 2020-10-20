'use strict';

const winston = require('winston');
const config = require('../config');
const loggingTransports = [];
const exceptionTransports = [];
const notProd = config.nodeEnv !== 'production';

const customFormatter = options => {
  // - Return string will be passed to logger.
  // - Optionally, use options.colorize(options.level, <string>) to
  //   colorize output based on the log level.
  return options.timestamp() + ' ' +
      options.sessionID ? `sessionID=${options.sessionID}` : '' +
      config.colorize(options.level, options.level.toUpperCase()) + ' ' +
      (options.message ? options.message : '') +
      (options.path ? options.path : '') +
      (options.err ? `err=${options.err}` : '') +
      (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
};

loggingTransports.push(
    new winston.transports.Console({
      silent: config.loglevel === 'silent',
      level: config.loglevel,
      json: !notProd,
      timestamp: true,
      colorize: true,
      format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
      ),
      stringify: function stringify(obj) {
        return JSON.stringify(obj);
      },
      formatter: customFormatter
    })
);

exceptionTransports.push(
    new winston.transports.Console({
      json: !notProd,
      timestamp: true,
      colorize: true,
      format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
      ),
      stringify: function stringify(obj) {
        return JSON.stringify(obj);
      },
      formatter: customFormatter
    })
);

const levels = {
  levels: {
    trace: 3,
    info: 2,
    warn: 1,
    error: 0
  }
};

const loggerConfig = {
  levels: levels.levels,
  level: config.logLevel,
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true
};

if (notProd) {
  delete loggerConfig.exceptionHandlers;
}

const logger = winston.createLogger(loggerConfig);

if (config.nodeEnv === 'test') {
  logger.silent = true;
}

module.exports = logger;

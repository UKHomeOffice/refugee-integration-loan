'use strict';

const winston = require('winston');
const config = require('../config');
const loggingTransports = [];
const exceptionTransports = [];
const notProd = config.env !== 'production';


loggingTransports.push(
    new winston.transports.Console({
      silent: config.loglevel === 'silent',
      level: config.loglevel,
      json: !notProd,
      timestamp: true,
      colorize: true,
      stringify: function stringify(obj) {
        return JSON.stringify(obj);
      }
    })
);

exceptionTransports.push(
    new winston.transports.Console({
      json: !notProd,
      timestamp: true,
      colorize: true,
      stringify: function stringify(obj) {
        return JSON.stringify(obj);
      }
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

module.exports = logger;

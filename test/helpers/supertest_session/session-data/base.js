'use strict';

const _ = require('lodash');

module.exports = (appName) => {
  const possibleSteps = require(`./${appName}/steps`);

  return (stepOrData, data) => {
    let props = {};
    if (typeof stepOrData === 'string') {
      props.steps = _.dropRightWhile(possibleSteps, val => {
        return val !== stepOrData;
      });
      props.steps.pop();
    } else {
      props.steps = possibleSteps;
    }
    props.steps.forEach((prop) => {
      if (prop !== '/') {
        try {
          /* eslint-disable no-nested-ternary */
          Object.assign(props, require(`./${appName}/pages${prop}`),
            data ? data : typeof stepOrData === 'object' ? stepOrData : {});
          /* eslint-disable no-empty */
        } catch (e) {}
        /* eslint-enable no-empty */
        /* eslint-enable no-nested-ternary */
      }
    });
    return props;
  };
};

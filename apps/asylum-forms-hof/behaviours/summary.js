/* eslint-disable no-underscore-dangle */
'use strict';

const mix = require('mixwith').mix;
const Behaviour = require('hof-behaviour-summary-page');

const _ = require('lodash');
const getValue = (value, field, translate) => {
  const key = `fields.${field}.options.${value}.label`;
  let result = translate(key);
  if (result === key) {
    result = value;
  }
  return result;
};

module.exports = Base => class extends mix(Base).with(Behaviour) {

  parseSections(req) {
    const result = super.parseSections(req);
    const section = this.addLoopSection(req);
    result.splice(1, 0, section);
    return result;
  }

  getStepForField(key, steps, model) {

    return Object.keys(steps).find(step => {
      if (!steps[step].fields) {
        return key === step.substring(1) && model.get(key) !== undefined;
      }
      return steps[step].fields && steps[step].fields.indexOf(key) > -1;
    });
  }

  getFieldData(key, req) {
    const settings = req.form.options;
    if (typeof key === 'string') {
      return {
        label: req.translate([
          `pages.confirm.fields.${key}.label`,
          `fields.${key}.summary`,
          `fields.${key}.label`,
          `fields.${key}.legend`
        ]),
        value: getValue(req.sessionModel.get(key), key, req.translate),
        step: this.getStepForField(key, settings.steps, req.sessionModel),
        field: key
      };
    } else if (typeof key.field === 'string') {
      const obj = Object.assign(this.getFieldData(key.field, req), key);
      if (typeof key.parse === 'function') {
        obj.value = key.parse(obj.value);
      }
      return obj;
    }
    return {};
  }

  addLoopSection(req) {
    const loopStep = req.form.options.steps['/dependent-details'];
    const tenants = req.sessionModel.get(loopStep.storeKey);

    const includeField = (value, field) => {
      return req.form.options.sections['dependent-details'].map(f =>
        (typeof f === 'object') ? f.field : f
      ).indexOf(field) > -1;
    };

    const formatValue = (value, field) => {
      const fieldConfig = req.form.options.sections['dependent-details'].find(f =>
        f === field || f.field === field
      );
      if (typeof fieldConfig === 'string') {
        return value;
      }
      return fieldConfig.parse ? fieldConfig.parse(value) : value;
    };

    const getSubStep = (field, subSteps) =>
      _.findKey(subSteps, subStep => subStep.fields.indexOf(field) > -1);

    let _id;

    const fields = _.flatten(
      _.map(tenants, (tenant, id) =>
        _.map(
          _.pickBy(tenant, includeField), (value, field) => ({
            field,
            className: _id !== id ? (_id = id) && 'dependent' : '',
            value: formatValue(value, field),
            step: `/tenant-details/${getSubStep(field, loopStep.subSteps)}/${id}`,
            label: req.translate([
              `pages.confirm.fields.${field}.label`,
              `fields.${field}.summary`,
              `fields.${field}.label`,
              `fields.${field}.legend`
            ])
          }))
      )
    );
    return {
      section: req.translate('pages.dependent-details.header'),
      fields
    };
  }
};
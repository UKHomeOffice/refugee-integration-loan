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

  configure(req, res, callback) {
    super.configure(req, res, callback);
  }

  parseSections(req) {
    const result = super.parseSections(req);
    const splicedResult = this.addLoopSections(req, result);
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
        summaryDescription: req.translate([
          `fields.${key}.summaryDescription`,
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

  addLoopSections(req, sections) {
    const addLoopSection = (req, loopStep, path) => {
      const entities = req.sessionModel.get(loopStep.loopData.storeKey);
  
      const includeField = (value, field) => {
        return req.form.options.loopSections[loopStep.loopData.sectionKey].map(f =>
          (typeof f === 'object') ? f.field : f
        ).indexOf(field) > -1;
      };
  
      const formatValue = (value, field) => {
        const fieldConfig = req.form.options.loopSections[loopStep.loopData.sectionKey].find(f =>
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
      let spacer = {
          spacer: true
      };
      let applySpacer = loopStep.loopData.applySpacer == null ? true : loopStep.loopData.applySpacer;
  
      const fields = _.flatten(
        _.map(entities, (entity, id) =>
          _.flatMap(
            _.pickBy(entity, includeField), (value, field) => {
              let isFirstField = _id !== id;
              _id = id;
              let fieldEntry = {
                  field,
                  value: formatValue(value, field),
                  step: `${path}/${getSubStep(field, loopStep.subSteps)}/${id}`,
                  label: req.translate([
                    `pages.confirm.fields.${field}.label`,
                    `fields.${field}.summary`,
                    `fields.${field}.label`,
                    `fields.${field}.legend`
                  ]),
                  summaryDescription: req.translate([
                    `fields.${field}.summaryDescription`,
                    `fields.${field}.label`,
                    `fields.${field}.legend`
                  ])
              };
              return id > 0 && isFirstField && applySpacer ? [spacer, fieldEntry] : [fieldEntry]
            })
        )
      );
      return {
        section: req.translate(`pages.${loopStep.loopData.sectionKey}.header`),
        fields
      };
    }

    let foundSections = 0;
    Object.keys(req.form.options.steps).forEach((key, index) => {
      const step = req.form.options.steps[key];

      if(step.loopData) {
          //this is a loop step
          const loopSection = addLoopSection(req, step, key);
          if(_.size(loopSection.fields) > 0) {
            //insert our loop section if it has any fields to show
            sections.splice(foundSections, 0, loopSection);
            foundSections++;
          }
      } else if(_.find(sections, section => section.fields && section.fields.length > 0 && section.fields[0].step === key)) {
          foundSections++;
      }
    })
    return sections;
  }

  
};
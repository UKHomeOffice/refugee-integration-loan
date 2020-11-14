'use strict';
const _ = require('lodash');

module.exports = superclass => class extends superclass {

  parseSections(req) {
    const settings = req.form.options;
    const sections = this.getSectionSettings(settings);
    return Object.keys(sections)
      .map(section => {
        const fields = sections[section] || [];

        return {
          section: req.translate([
            `pages.confirm.sections.${section}.header`,
            `pages.${section}.header`
          ]),
          fields: _.flatten(fields.map(field => this.getFieldData(field, req))).filter(f => f.value)
        };
      })
      .filter(section => section.fields.length);
  }

  getSectionSettings(settings) {
    if (settings.sections) {
      return settings.sections;
    }
    return Object.keys(settings.steps).reduce((map, key) => {
      const fields = settings.steps[key].fields;
      if (fields) {
        map[key.replace(/^\//, '')] = fields;
      }
      return map;
    }, {});
  }

  getStepForField(key, steps) {
    return Object.keys(steps).filter(step => {
      return steps[step].fields && steps[step].fields.indexOf(key) > -1;
    })[0];
  }


  translateLabel(key, req) {
    return req.translate([
      `pages.confirm.fields.${key}.label`,
      `fields.${key}.label`,
      `fields.${key}.legend`
    ]);
  }

  getFieldData(key, req) {

    if (key === 'dependents') {
      console.log('hi');
    }
    const settings = req.form.options;
    if (typeof key === 'string') {
      return {
        label: this.translateLabel(key, req),
        value: req.sessionModel.get(key) || settings.nullValue,
        step: this.getStepForField(key, settings.steps),
        field: key
      };
    } else if (typeof key.field === 'string') {
      let obj = Object.assign(this.getFieldData(key.field, req), key);

      if (key.dependsOn) {
        const dependencyValue = req.sessionModel.get(key.dependsOn);
        if (!dependencyValue || dependencyValue === 'no') {
          return {};
        }
      }

      if (typeof key.parse === 'function') {
        obj.value = key.parse(obj.value);
      }

      if (Array.isArray(obj.value)) {

        obj = obj.value.flatMap((element, index) => {
          return element.fields.map(inner => {
            const changeLink = `${req.baseUrl}${obj.step}/edit/${index}`;
            return { 'label': this.translateLabel(inner.field, req), value: inner.value, changeLink };
          });
        });
      }

      return obj;
    }
    return {};
  }

  locals(req, res) {
    const rows = this.parseSections(req);

    return Object.assign({}, super.locals(req, res), {
      rows
    });
  }

};

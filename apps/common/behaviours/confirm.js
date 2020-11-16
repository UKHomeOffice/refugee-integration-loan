'use strict';
const _ = require('lodash');

module.exports = superclass => class extends superclass {

  parseSections(req) {
    const settings = req.form.options;
    const sections = this.getSectionSettings(settings);
    return Object.keys(sections)
      .map(section => {
        const fields = sections[section] || [];
        const populatedFields =
          _.flatten(fields.map(field => {
                const processed = this.processDataSectionsField(field, req);
                return Array.isArray(processed.value) ? this.expandAggregatedFields(processed, req) : processed;
              }
            )
          ).filter(f => f.value);

        return {
          section: req.translate([
            `pages.confirm.sections.${section}.header`,
            `pages.${section}.header`
          ]),
          fields: populatedFields
        };
      })
      .filter(section => section.fields.length);
  }

  expandAggregatedFields(obj, req) {
    return obj.value.flatMap((element, index) => {
      return element.fields.map(inner => {
        const changeLink = `${req.baseUrl}${obj.step}/edit/${index}/${inner.field}`;
        return { 'label': this.translateLabel(inner.field, req), value: inner.value, changeLink };
      });
    });
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
    const settings = req.form.options;

    return {
      label: this.translateLabel(key, req),
      value: req.sessionModel.get(key) || settings.nullValue,
      step: this.getStepForField(key, settings.steps),
      field: key
    };
  }

  processDataSectionsField(key, req) {
    if (typeof key === 'string') {
      return this.getFieldData(key, req);
    } else if (typeof key.field === 'string') {
      if (key.dependsOn) {
        const dependencyValue = req.sessionModel.get(key.dependsOn);
        if (!dependencyValue || dependencyValue === 'no') {
          return {};
        }
      }

      let obj = Object.assign(this.getFieldData(key.field, req), key);

      if (typeof key.parse === 'function') {
        obj.value = key.parse(obj.value);
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

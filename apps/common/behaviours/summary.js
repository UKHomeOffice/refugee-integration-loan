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
              return Array.isArray(processed.value) && processed.value[0].fields ?
                this.expandAggregatedFields(processed, req) : processed;
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
      const fields = element.fields.map(inner => {
        const changeField = inner.changeField || inner.field;
        const changeLink = `${req.baseUrl}${obj.step}/edit/${index}/${changeField}`;
        return { 'label': this.translateLabel(inner.field, req), value: inner.value, changeLink, parsed: inner.parsed };
      });

      if (obj.addElementSeparators && index < obj.value.length - 1) {
        fields.push({ label: '', value: 'separator', changeLink: '', isSeparator: true });
      }

      return fields;
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

  translateCheckBoxOptions(key, value, req) { // todo: handle radio buttons
    return req.translate(`fields[${key}].options.[${value}]`);
  }

  getFieldData(key, req) {
    const settings = req.form.options;

    const fieldIsCheckbox = req.form.options.fieldsConfig[key] &&
      req.form.options.fieldsConfig[key].mixin === 'checkbox-group';
    let value = req.sessionModel.get(key);

    if (fieldIsCheckbox && value) {
      if (Array.isArray(value)) {
        value = value.map(val => this.translateCheckBoxOptions(key, val, req));
      } else {
        value = this.translateCheckBoxOptions(key, value, req);
      }
    }

    const parsed = value ? value.parsed : undefined;

    return {
      parsed,
      label: this.translateLabel(key, req),
      value: value || settings.nullValue,
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

      obj.addElementSeparators = key.addElementSeparators;

      return obj;
    }
    return {};
  }

  locals(req, res) {
    const rows = this.parseSections(req);

    const locals = Object.assign({}, super.locals(req, res), {
      rows
    });

    return locals;
  }
};

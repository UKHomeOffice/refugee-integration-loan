'use strict';

module.exports = superclass => class extends superclass {

  parseSections(req) {
    const sections = req.form.options.sections;
    return Object.keys(sections)
      .map(section => {
        return {
          section: req.translate([
            `pages.confirm.sections.${section}.header`,
            `pages.${section}.header`
          ]),
          fields: this.parseSectionFields(sections[section], req)
        };
      })
      .filter(section => section.fields.length);
  }

  parseSectionFields(section, req) {
    const fields = section || [];
    const populatedFields = fields.map(field => this.processDataSectionsField(field, req)).filter(f => f.value);

    if (populatedFields[0] && Array.isArray(populatedFields[0].value)) {
      return this.expandAggregatedFields(populatedFields, req);
    }
    return populatedFields;

  }

  expandAggregatedFields(obj, req) {
    return obj[0].value.flatMap((element, index) => {
      const fields = element.fields.flatMap(inner => {
        const changeField = inner.changeField || inner.field;
        const changeLink = `${req.baseUrl}${obj[0].step}/edit/${index}/${changeField}`;
        return {
          changeLinkDescription: this.translateChangeLink(inner.field, req),
          label: this.translateLabel(inner.field, req),
          value: inner.value,
          changeLink,
          parsed: inner.parsed,
          field: inner.field
        };
      });

      if (obj[0].addElementSeparators && index < obj[0].value.length - 1) {
        fields.push({ label: '', value: 'separator', changeLink: '', isSeparator: true });
      }

      return fields;
    });
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

  translateChangeLink(key, req) {
    return req.translate([`fields.${key}.changeLinkDescription`,
      `pages.confirm.fields.${key}.label`,
      `fields.${key}.summary`,
      `fields.${key}.label`,
      `fields.${key}.legend`]);
  }


  translateCheckBoxOptions(key, value, req) {
    return req.translate(`fields[${key}].options.[${value}]`);
  }

  getFieldData(key, req) {
    const settings = req.form.options;

    const fieldIsCheckbox = req.form.options.fieldsConfig[key] &&
      (req.form.options.fieldsConfig[key].mixin === 'checkbox-group' ||
        req.form.options.fieldsConfig[key].mixin === 'radio-group');
    let value = req.sessionModel.get(key);

    if (fieldIsCheckbox && value) {
      if (Array.isArray(value)) {
        value = value.map(val => this.translateCheckBoxOptions(key, val, req));
      } else {
        value = this.translateCheckBoxOptions(key, value, req);
      }
    }

    return {
      changeLinkDescription: this.translateChangeLink(key, req),
      parsed: value ? value.parsed : undefined,
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

      obj.addElementSeparators = key.addElementSeparators || false;

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

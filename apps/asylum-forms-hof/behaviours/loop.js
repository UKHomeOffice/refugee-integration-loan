/* eslint-disable no-underscore-dangle */

'use strict';

const _ = require('lodash');
const Hogan = require('hogan.js');

function hoganRender(input, ctx) {
  if (input) {
    return Hogan.compile(input).render(ctx);
  }
  return undefined;
}

function conditionalTranslate(key, t) {
  const result = t(key);
  if (result !== key) {
    return result;
  }
  return undefined;
}

const isValue = (f, field) => (typeof f === 'string') ? f === field : f.field === field;

function formatValue(value, field, sections) {
  if (value === '' || value === null || value === undefined) {
    return value;
  }
  const fieldConfig = _.find(sections, section =>
    _.find(section, f => isValue(f, field))
  ).find(f => isValue(f, field));
  if (typeof fieldConfig === 'object' && fieldConfig.parse) {
    return fieldConfig.parse(value);
  }
  return value;
}

module.exports = superclass => class extends superclass {

  constructor(options) {
    super(options);
    this.options.loopData.storeKey = this.options.loopData.storeKey || 'items';
    this.confirmStep = this.options.loopData.confirmStep;
  }

  stepIncluded(step) {
    return Object.keys(this.options.subSteps).indexOf(step) > -1;
  }

  getStep(req) {
    return this.options.subSteps[req.params.action];
  }

  finalStep() {
    return _.findKey(this.options.subSteps, s => !s.next);
  }

  getBackLink(req, res) {
    const subSteps = _.intersection(
      Object.keys(this.options.subSteps),
      [
       ...(req.sessionModel.get('subSteps') || []),
        req.params.action 
      ]
    );
    const finalStep = this.finalStep();
    if (subSteps.length == 1 || req.params.action === finalStep) {
      return super.getBackLink(req, res);
    }
    const index = subSteps.indexOf(req.params.action);
    const relativeRoute = this.options.route.startsWith('/') ? this.options.route.substring(1) : this.options.route;
    return `${relativeRoute}/${(subSteps[index - 1] || finalStep)}`;
  }

  redirectTo(step, req, res) {
    return res.redirect(`${req.baseUrl.replace(/\/$/, '')}${this.options.route.replace(/\/$/, '')}/${step}`);
  }

  prereqsSatisfied(req) {
    const step = this.getStep(req);
    let prereqs = step.prereqs;
    if (!step.prereqs) {
      return true;
    }
    prereqs = _.castArray(prereqs);
    return prereqs.every(prereq => req.sessionModel.get(prereq) !== undefined);
  }

  editing(req) {
    return req.params.edit === 'edit' || req.params.edit === 'change';
  }

  hasItems(req) {
    return _.size(req.sessionModel.get(this.options.loopData.storeKey));
  }

  get(req, res, callback) {
    if (!req.params.action ||
      !this.stepIncluded(req.params.action) ||
      (!this.prereqsSatisfied(req) && !this.editing(req))
    ) {
      const step = this.hasItems(req) ?
        this.finalStep() :
        this.options.firstStep;
      return this.redirectTo(step, req, res);
    }
    if (req.params.edit === 'delete' && req.params.id) {
      return this.removeItem(req, res);
    }
    return super.get(req, res, callback);
  }

  configure(req, res, callback) {
    const step = this.getStep(req);
    Object.assign(req.form.options, step, {
      fields: _.pick(req.form.options.fields, step.fields)
    });
    callback();
  }

  removeItem(req, res) {
    const items = req.sessionModel.get(this.options.loopData.storeKey);
    req.sessionModel.set(this.options.loopData.storeKey, _.omit(items, req.params.id));
    const steps = Object.keys(this.options.subSteps);
    const step = _.size(items) > 1 ? steps[steps.length - 1] : steps[0];
    return res.redirect(`${req.baseUrl}${this.options.route}/${step}`);
  }

  getItems(req) {
    return req.sessionModel.get(req.form.options.loopData.storeKey) || {};
  }

  getValues(req, res, callback) {
    super.getValues(req, res, (err, values) => {
      if (req.params.id !== undefined) {
        const items = this.getItems(req);
        values = Object.assign({}, values, items[req.params.id] || {});
      }
      return callback(err, values);
    });
  }

  getNextStep(req, res) {
    if (req.params.edit === 'edit') {
      return this.confirmStep;
    }

    const stepName = req.params.action;
    const loopCondition = req.form.options.loopCondition;
    const next = this.getNext(req, res);
    const last = _.findKey(req.form.options.subSteps, step => !step.next);

    if (req.params.edit === 'change') {
      const re = new RegExp(`(${req.form.options.route}/)${req.params.action}.*`);
      return req.baseUrl + req.url.replace(re, `$1${last}`);
    }

    if (stepName !== last) {
      const re = new RegExp(`${stepName}$`);
      return req.baseUrl + req.url.replace(re, next);
    } else if (loopCondition && req.form.values[loopCondition.field] === loopCondition.value) {
      return req.baseUrl + req.url.replace(stepName, req.form.options.firstStep).replace(req.params.id, '');
    }
    return super.getNextStep(req, res);
  }

  getNext(req, res) {
    if (req.form.options.forks) {
      return super.getForkTarget(req, res);
    }
    return req.form.options.next;
  }

  saveValues(req, res, callback) {
    const steps = Object.keys(req.form.options.subSteps);
    if (req.params.id) {
      const items = this.getItems(req);
      Object.keys(req.form.values).forEach(field => {
        if (req.form.values[field]) {
          items[req.params.id][field] = req.form.values[field];
        } else {
          delete items[req.params.id][field];
        }
      });
      req.sessionModel.set(req.form.options.loopData.storeKey, items);
      return callback();
    }
    if (this.getNext(req, res) === steps[steps.length - 1] || steps.length == 1) {
      return super.saveValues(req, res, (err) => {
        if (err) {
          return callback(err);
        }
        const items = req.sessionModel.get(req.form.options.loopData.storeKey) || {};
        let id = req.params.id;
        if (id === undefined) {
          id = parseInt(req.sessionModel.get(`${req.form.options.loopData.storeKey}-id`) || 0, 10);
          req.sessionModel.set(`${req.form.options.loopData.storeKey}-id`, id + 1);
        }
        items[id] = Object.keys(this.options.fields).reduce((obj, field) => {
          const value = req.sessionModel.get(field);
          if (value !== '') {
            return Object.assign(obj, {
              [field]: value
            });
          }
          return obj;
        }, {});
        req.sessionModel.set(req.form.options.loopData.storeKey, items);
        req.sessionModel.unset(Object.keys(this.options.fields));
        return callback();
      });
    }
    if (steps.indexOf(req.params.action) === steps.length - 1) {
      return callback();
    }
    return super.saveValues(req, res, callback);
  }

  locals(req, res) {
    const locals = super.locals(req, res);
    const pagePath = `${locals.route}-${req.params.action}`;
    let items = req.sessionModel.get(req.form.options.loopData.storeKey);

    const fields = _.reduce(items, (arr, item) =>
      _.uniq(
        arr.concat(
          Object.keys(item).filter(field =>
            !this.options.fields[field].omitFromSummary
          )
        )
      )
    , []);

    items = _.map(items, (item, id) => ({
      id,
      index: Number(id)+1,
      deleteRoute: req.form.options.firstStep,
      fields: _.map(fields, field => ({
        field,
        header: req.translate([`fields.${field}.summary`, `fields.${field}.label`, `fields.${field}.legend`]),
        subroute: _.findKey(req.form.options.subSteps, subStep => subStep.fields.indexOf(field) > -1),
        value: formatValue(item[field], field, req.form.options.steps[this.confirmStep].loopSections)
      }))
    }));

    const multipleItems = items.length > 1;

    const title = hoganRender(conditionalTranslate(`pages.${pagePath}.header`, req.translate),
      Object.assign({}, res.locals, {
        next: items.length ? 'next ' : null
      })
    );

    const intro = conditionalTranslate(`pages.${pagePath}.intro`, req.translate);

    return Object.assign({}, locals, {
      title,
      intro,
      itemTitle: req.translate(`pages.${this.options.loopData.sectionKey}.summary-item`),
      multipleItems,
      items,
      summaryTitle: req.translate(`pages.${this.options.loopData.sectionKey}.header`),
      hasItems: items.length,
      deleteText: req.translate(`pages.${this.options.loopData.sectionKey}.delete-text`)
    });
  }

  successHandler(req, res) {
    const subSteps = _.without((req.sessionModel.get('subSteps') || []), req.params.action);
    subSteps.push(req.params.action);
    req.sessionModel.set('subSteps', subSteps);
    return super.successHandler(req, res);
  }
};
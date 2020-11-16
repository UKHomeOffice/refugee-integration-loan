'use strict';

const _ = require('lodash');
module.exports = superclass => class LoopController extends superclass {

  constructor(options) {
    if (!options.aggregateTo) {
      throw new Error('options.aggregateTo is required for loops');
    }
    if (!options.aggregateFrom) {
      throw new Error('options.aggregateField is required for loops');
    }
    super(options);
  }

  removeItem(req, res, id) {
    const aggregateArray = this.getAggregateArray(req);
    aggregateArray.splice(id, 1);

    if (aggregateArray.length === 0) {
      res.redirect(`${req.baseUrl}/${req.form.options.backLink}`);
    } else {
      res.redirect(`${req.baseUrl}/${req.form.options.route}`);
    }
  }

  updateItem(req) {
    const id = req.sessionModel.get('itemToReplaceId');
    req.sessionModel.unset('itemToReplaceId');

    const items = req.sessionModel.get(req.form.options.aggregateTo);


    req.form.options.aggregateFrom.forEach(aggregateFromField => {
      items[id].fields.find((field) =>
        field.field === aggregateFromField).value = req.sessionModel.get(aggregateFromField);
      req.sessionModel.unset(aggregateFromField);
    });

    items[id].itemTitle = items[id].fields[0].value;

    req.sessionModel.set(req.form.options.aggregateTo, items);
  }

  editItem(req, res, id) {
    const items = this.getAggregateArray(req);

    req.sessionModel.set('itemToReplaceId', id);

    req.form.options.aggregateFrom.forEach(aggregateFromField => {
      req.sessionModel.set(aggregateFromField,
        items[id].fields.find((field) => field.field === aggregateFromField).value);
    });

    const editPath = req.params.edit ? `/edit#${req.params.edit}` : '';
    res.redirect(`${req.baseUrl}/${req.form.options.returnTo}${editPath}`);
  }

  addItem(req) {
    const items = this.getAggregateArray(req);
    const fields = [];

    let itemTitle = '';

    req.form.options.aggregateFrom.forEach(aggregateFromField => {
      const isTitleField = req.form.options.titleField === aggregateFromField;
      const value = req.sessionModel.get(aggregateFromField);

      if (isTitleField) {
        itemTitle = value;
      }

      fields.push({
        field: aggregateFromField,
        value,
        showInSummary: !isTitleField
      });
      req.sessionModel.unset(aggregateFromField);
    });

    items.push({ itemTitle, fields });

    req.sessionModel.set(req.form.options.aggregateTo, items);
  }

  getAggregateArray(req) {
    return req.sessionModel.get(req.form.options.aggregateTo) || [];
  }

  newFieldsProvided(req) {
    let fieldsProvided = false;

    req.form.options.aggregateFrom.forEach(aggregateFromField => {
      if (req.sessionModel.get(aggregateFromField)) {
        fieldsProvided = true;
      }
    });

    return fieldsProvided;
  }

  getValues(req, res, next) {
    const id = req.params.id;
    const action = req.params.action;

    if (req.sessionModel.get('itemToReplaceId')) {
      this.updateItem(req);
    } else if (action === 'delete' && id) {
      this.removeItem(req, res, id);
      return {};
    } else if (action === 'edit' && id) {
      this.editItem(req, res, id, req.params.edit);
      return {};
    } else if (this.newFieldsProvided(req)) {
      this.addItem(req, res);
    } else if (this.getAggregateArray(req).length === 0) {
      res.redirect(`${req.baseUrl}/${req.form.options.returnTo}`);
      return {};
    }

    return super.getValues(req, res, next);
  }

  locals(req, res) {
    const items = this.getAggregateArray(req);

    items.forEach((element, index) => {
      element.index = index;
    });

    return Object.assign({}, super.locals(req, res), {
      items,
      hasItems: items.length > 0,
      returnTo: req.form.options.returnTo,
      field: req.form.options.aggregateTo
    });
  }
};

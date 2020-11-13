'use strict';

const _ = require('lodash');
const uuid = require('uuid/v1');
module.exports = superclass => class LoopController extends superclass {

  constructor(options) {
    if (!options.aggregateTo) {
      throw new Error('options.aggregateTo is required for loops');
    }
    if (!options.aggregateField || !options.aggregateField.length) {
      throw new Error('options.aggregateField is required for loops');
    }
    super(options);
  }

  removeItem(req) {
    const id = req.query.delete;
    const items = req.sessionModel.get(req.form.options.aggregateTo).filter(item => item.id !== id);
    req.sessionModel.set(req.form.options.aggregateTo, items);
  }

  updateItem(req) {
    const id = req.sessionModel.get('itemToReplaceId');
    req.sessionModel.unset('itemToReplaceId');

    const items = req.sessionModel.get(req.form.options.aggregateTo);
    const itemIndex = items.findIndex(item => item.id === id);

    items[itemIndex].itemTitle = req.sessionModel.get(req.form.options.aggregateField);

    req.sessionModel.set(req.form.options.aggregateTo, items);
  }

  editItem(req, res) {
    const id = req.query.edit;
    const items = req.sessionModel.get(req.form.options.aggregateTo);
    const itemIndex = items.findIndex(item => item.id === id)

    req.sessionModel.set('itemToReplaceId', id);
    req.sessionModel.set(req.form.options.aggregateField, items[itemIndex].itemTitle);
    res.redirect(req.form.options.returnTo);
  }

  addItem(req) {
    const aggregate = req.sessionModel.get(req.form.options.aggregateTo) || [];
    const newField = req.sessionModel.get(req.form.options.aggregateField);

    if (newField) {
      aggregate.push({ id: uuid(), itemTitle: newField });
      req.sessionModel.unset(req.form.options.aggregateField);
    }

    req.sessionModel.set(req.form.options.aggregateTo, aggregate);
  }

  getValues(req, res, next) {
    if (req.query.delete) {
      this.removeItem(req);
    } else if (req.query.edit) {
      this.editItem(req, res);
    } else if (req.sessionModel.get('itemToReplaceId')) {
      this.updateItem(req);
    } else {
      this.addItem(req, res);
    }
    return super.getValues(req, res, next);
  }

  locals(req, res) {
    const items = req.form.values[req.form.options.aggregateTo] || [];
    return Object.assign({}, super.locals(req, res), {
      items,
      hasItems: items.length > 0,
      returnTo: req.form.options.returnTo,
      field: req.form.options.aggregateTo
    });
  }
};

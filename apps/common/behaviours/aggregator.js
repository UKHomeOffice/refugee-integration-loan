'use strict';

const path = require('path');

module.exports = superclass => class extends superclass {

  constructor(options) {
    if (!options.aggregateTo) {
      throw new Error('options.aggregateTo is required for loops');
    }
    if (!options.aggregateFrom) {
      throw new Error('options.aggregateField is required for loops');
    }
    super(options);
  }

  deleteItem(req, res, id) {
    const aggregateArray = this.getAggregateArray(req).filter((element, index) => index !== parseInt(id, 10));
    req.sessionModel.set(req.form.options.aggregateTo, aggregateArray);
    res.redirect(`${req.baseUrl}${req.form.options.route}`);
  }

  updateItem(req, res) {
    const id = req.sessionModel.get(`${req.form.options.aggregateTo}-itemToReplaceId`);

    const items = req.sessionModel.get(req.form.options.aggregateTo);

    let itemTitle = '';

    req.form.options.aggregateFrom.forEach(aggregateFromElement => {
      const aggregateFromField = aggregateFromElement.field || aggregateFromElement;

      if (req.form.options.titleField === aggregateFromField) {
        itemTitle = req.sessionModel.get(aggregateFromField);
      }

      items[id].fields.find((field) =>
        field.field === aggregateFromField).value = req.sessionModel.get(aggregateFromField);
      req.sessionModel.unset(aggregateFromField);
    });

    items[id].itemTitle = itemTitle;

    req.sessionModel.set(req.form.options.aggregateTo, items);
    req.sessionModel.unset(`${req.form.options.aggregateTo}-itemToReplaceId`);


    if (req.sessionModel.get('returnToSummary') && !this.continueOnEdit) {
      req.sessionModel.unset('returnToSummary');
      res.redirect(path.join(req.baseUrl, this.confirmStep));
    } else {
      res.redirect(`${req.baseUrl}${req.form.options.route}`);
    }
  }

  editItem(req, res, id) {
    const items = this.getAggregateArray(req);

    if (req.query.returnToSummary) {
      req.sessionModel.set('returnToSummary', true);
    }

    req.sessionModel.set(`${req.form.options.aggregateTo}-itemToReplaceId`, id);

    req.form.options.aggregateFrom.forEach(aggregateFromElement => {
      const aggregateFromField = aggregateFromElement.field || aggregateFromElement;

      req.sessionModel.set(aggregateFromField,
        items[id].fields.find((field) => field.field === aggregateFromField).value);
    });

    const editPath = req.params.edit ? `/edit#${req.params.edit}` : '/edit';
    res.redirect(`${req.baseUrl}/${req.form.options.sourceStep}${editPath}`);
  }

  addItem(req, res) {
    const items = this.getAggregateArray(req);
    const fields = [];

    let itemTitle = '';

    req.form.options.aggregateFrom.forEach(aggregateFromElement => {
      const aggregateFromField = aggregateFromElement.field || aggregateFromElement;
      const isTitleField = req.form.options.titleField === aggregateFromField;
      const value = req.sessionModel.get(aggregateFromField);

      if (isTitleField) {
        itemTitle = value;
      }

      fields.push({
        field: aggregateFromField,
        value,
        showInSummary: !isTitleField,
        changeField: aggregateFromElement.changeField
      });
      req.sessionModel.unset(aggregateFromField);
    });

    items.push({ itemTitle, fields });

    req.sessionModel.set(req.form.options.aggregateTo, items);
    res.redirect(`${req.baseUrl}${req.form.options.route}`);
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

    const deleteItem = () => action === 'delete' && id;
    const editItem = () => action === 'edit' && id;
    const updateItem =
      () => action === 'edit' && req.sessionModel.get(`${req.form.options.aggregateTo}-itemToReplaceId`);
    const noItemsPresent = () => this.getAggregateArray(req).length === 0;

    if (deleteItem()) {
      this.deleteItem(req, res, id);
    } else if (editItem()) {
      this.editItem(req, res, id, req.params.edit);
    } else if (updateItem()) {
      this.updateItem(req, res);
    } else if (this.newFieldsProvided(req)) {
      this.addItem(req, res);
    } else if (noItemsPresent()) {
      res.redirect(`${req.baseUrl}/${req.form.options.sourceStep}`);
    }

    if (!res.headersSent) {
      return super.getValues(req, res, next);
    }

    return {};
  }

  runFieldParsers(req) {
    const items = this.getAggregateArray(req);

    items.forEach((item) => {
      item.fields.forEach(field => {
        const parser = req.form.options.fieldsConfig[field.field].parse;
        if (parser) {
          field.parsed = parser(field.value);
        }
      });
    });
  }

  locals(req, res) {
    const items = this.getAggregateArray(req);

    this.runFieldParsers(req);

    items.forEach((element, index) => {
      element.index = index;
    });

    return Object.assign({}, super.locals(req, res), {
      items,
      hasItems: items.length > 0,
      sourceStep: req.form.options.sourceStep,
      field: req.form.options.aggregateTo,
      addAnotherLinkText: req.form.options.addAnotherLinkText,
    });
  }
};

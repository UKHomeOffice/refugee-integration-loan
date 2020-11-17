'use strict';

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
    const aggregateArray = this.getAggregateArray(req);
    aggregateArray.splice(id, 1);
    req.sessionModel.set('otherNames', aggregateArray);

    if (aggregateArray.length === 0) {
      //todo: is this needed?
      res.redirect(`${req.baseUrl}/${req.form.options.backLink}`);
    } else {
      res.redirect(`${req.baseUrl}/${req.form.options.route}`);
    }
  }

  updateItem(req) {
    const id = req.sessionModel.get('itemToReplaceId');
    req.sessionModel.unset('itemToReplaceId');

    const items = req.sessionModel.get(req.form.options.aggregateTo);

    req.form.options.aggregateFrom.forEach(aggregateFromElement => {
      const aggregateFromField = aggregateFromElement.field || aggregateFromElement;

      items[id].fields.find((field) =>
        field.field === aggregateFromField).value = req.sessionModel.get(aggregateFromField); // todo : review this
      req.sessionModel.unset(aggregateFromField);
    });

    items[id].itemTitle = items[id].fields[0].value;

    req.sessionModel.set(req.form.options.aggregateTo, items);
  }

  editItem(req, res, id) {
    const items = this.getAggregateArray(req);

    // todo: make sure this is correctly unset when the user leaves the page manually
    req.sessionModel.set('itemToReplaceId', id);

    req.form.options.aggregateFrom.forEach(aggregateFromElement => {
      const aggregateFromField = aggregateFromElement.field || aggregateFromElement;

      req.sessionModel.set(aggregateFromField,
        items[id].fields.find((field) => field.field === aggregateFromField).value);
    });

    const editPath = req.params.edit ? `/edit#${req.params.edit}` : '';
    res.redirect(`${req.baseUrl}/${req.form.options.sourceStep}${editPath}`);
  }

  addItem(req) {
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

    if (action === 'delete' && id) {
      this.deleteItem(req, res, id);
      return {};
    } else if (action === 'edit' && id) {
      this.editItem(req, res, id, req.params.edit);
      return {};
    } else if (req.sessionModel.get('itemToReplaceId')) {
      this.updateItem(req);
    } else if (this.newFieldsProvided(req)) {
      this.addItem(req, res);
    } else if (this.getAggregateArray(req).length === 0) {
      res.redirect(`${req.baseUrl}/${req.form.options.sourceStep}`);
      return {};
    }

    return super.getValues(req, res, next);
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
      addAnotherLinkText: req.form.options.addAnotherLinkText
    });
  }
};

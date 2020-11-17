'use strict';

let request = require('../../../../helpers/request');
let response = require('../../../../helpers/response');
let AggregatorBehaviour = require('../../../../../apps/common/behaviours/aggregator');
const Model = require('hof-model');

describe('aggregator behaviour', () => {
  class Base {
  }

  let behaviour;
  let Behaviour;
  let req;
  let res;
  let next;

  describe.only('#getValues', () => {
    let superGetValuesStub;
    let redirectStub;

    beforeEach(() => {
      req = request();
      res = response();

      req.sessionModel = new Model({});
      req.form.options = {
        aggregateFrom: ['otherName'],
        aggregateTo: 'otherNames',
        sourceStep: 'add-other-name',
        route: 'other-names'};
      req.baseUrl = '/test';

      superGetValuesStub = sinon.stub();
      Base.prototype.getValues = superGetValuesStub;
      next = sinon.stub();

      Behaviour = AggregatorBehaviour(Base);
      behaviour = new Behaviour(req.form.options);

    });

    it('redirects to source step if no new data is provided and no elements are present', () => {
      behaviour.getValues(req, res);
      res.redirect.should.be.calledOnceWithExactly('/test/add-other-name');
    });

    it('calls super and returns if no new data is provided and new elements are present', () => {
      req.sessionModel.set('otherNames', [{itemTitle: 'John', fields: {}}]);
      behaviour.getValues(req, res, next);
      superGetValuesStub.should.be.calledOnceWithExactly(req, res, next);
    });

    describe('delete item', () => {
      beforeEach(() => {
        req.sessionModel.set('otherNames', [
          {itemTitle: 'John', fields: {value: 'John'}},
          {itemTitle: 'Steve', fields: {value: 'Steve'}},
          {itemTitle: 'Jane', fields: {value: 'Jane'}}
        ]);
        req.params.id = '1';
        req.params.action = 'delete';
      });

      it('deletes the item with the given id when the action is delete and an id is provide', () => {
        behaviour.getValues(req, res, next);
        req.sessionModel.get('otherNames').length.should.eql(2);
      });

      it('redirects back to step after deletion', () => {
        behaviour.getValues(req, res, next);
        res.redirect.should.be.calledOnceWithExactly('/test/other-names');
      });
    });

    describe('edit item', () => {
      beforeEach(() => {
        req.sessionModel.set('otherNames', [
          {itemTitle: 'John', fields: {value: 'John'}},
          {itemTitle: 'Steve', fields: {value: 'Steve'}},
          {itemTitle: 'Jane', fields: {value: 'Jane'}}
        ]);
        req.params.id = '1';
        req.params.action = 'edit';
      });

      it('populates the source form fields when the action is edit and an id is provided', () => {
        // behaviour.getValues(req, res, next);
        //res.redirect.should.be.calledOnceWithExactly('/test/add-other-name');
      });

      it('redirects to the source form', () => {
      });
    });

    describe('update item', () => {
      beforeEach(() => {

      });

      it('calls updateItem when itemToReplaceId is present in the session', () => {
      });

      it('replaces an item with the source step fields when itemToReplaceId is present in the session', () => {
      });
    });

    describe('add item', () => {
      beforeEach(() => {

      });

      it('calls addItem when no fields are provided but new fields are present in the source step', () => {
      });

      it('adds a new item when no fields are provided but new fields are present in the source step', () => {
      });
    });
  });
});

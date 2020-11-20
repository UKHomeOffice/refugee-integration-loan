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
  let getNextStepStub;

  describe('#getValues', () => {
    let superGetValuesStub;

    beforeEach(() => {
      req = request();
      res = response();

      req.sessionModel = new Model({});
      req.form.options = {
        aggregateFrom: ['otherName'],
        aggregateTo: 'otherNames',
        sourceStep: 'add-other-name',
        route: '/other-names'};
      req.baseUrl = '/test';

      superGetValuesStub = sinon.stub();
      Base.prototype.getValues = superGetValuesStub;
      next = sinon.stub();

      getNextStepStub = sinon.stub();
      Base.prototype.getNextStep = getNextStepStub;

      Behaviour = AggregatorBehaviour(Base);
      behaviour = new Behaviour(req.form.options);
      behaviour.confirmStep = '/confirm';

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
        req.sessionModel.get('otherNames').should.eql([
          {itemTitle: 'John', fields: {value: 'John'}},
          {itemTitle: 'Jane', fields: {value: 'Jane'}}
        ]);
      });

      it('redirects back to step after deletion', () => {
        behaviour.getValues(req, res, next);
        res.redirect.should.be.calledOnceWithExactly('/test/other-names');
      });
    });

    describe('edit item', () => {
      beforeEach(() => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];

        req.sessionModel.set('otherNames', [
          {itemTitle: 'John', fields: [{field: 'firstName', value: 'John'}, {field: 'surname', value: 'Smith'}]},
          {itemTitle: 'Steve', fields: [{field: 'firstName', value: 'Steve'}, {field: 'surname', value: 'Adams'}]},
          {itemTitle: 'Jane', fields: [{field: 'firstName', value: 'Jane'}, {field: 'surname', value: 'Doe'}]}
        ]);
        req.params.id = '1';
        req.params.action = 'edit';

        behaviour.getValues(req, res, next);
      });

      it('populates the source form fields when the action is edit and an id is provided', () => {
        req.sessionModel.get('firstName').should.eql('Steve');
        req.sessionModel.get('surname').should.eql('Adams');
      });

      it('redirects to the source form', () => {
        res.redirect.should.be.calledOnceWithExactly('/test/add-other-name/edit');
      });
    });

    describe('update item', () => {
      beforeEach(() => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];
        req.form.options.titleField = 'firstName';

        req.sessionModel.set('otherNames', [
          {itemTitle: 'John', fields: [{field: 'firstName', value: 'John'}, {field: 'surname', value: 'Smith'}]},
          {itemTitle: 'Steve', fields: [{field: 'firstName', value: 'Steve'}, {field: 'surname', value: 'Adams'}]},
          {itemTitle: 'Jane', fields: [{field: 'firstName', value: 'Jane'}, {field: 'surname', value: 'Doe'}]}
        ]);
        req.params.action = 'edit';
        req.sessionModel.set('otherNames-itemToReplaceId', 1);

        req.sessionModel.set('firstName', 'Sam');
        req.sessionModel.set('surname', 'Baker');

        behaviour.getValues(req, res, next);
      });

      it('replaces an item with the source step fields when itemToReplaceId is present ' +
        'in the session and action is edit', () => {
        const updatedElement = req.sessionModel.get('otherNames')[1];

        updatedElement.should.be.eql({
          itemTitle: 'Sam',
          fields: [
          {field: 'firstName', value: 'Sam'},
          {field: 'surname', value: 'Baker'},
        ]});
      });
    });

    describe('add item', () => {
      beforeEach(() => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];
        req.form.options.titleField = 'firstName';

        req.sessionModel.set('otherNames', [
          {itemTitle: 'John', fields: [{field: 'firstName', value: 'John'}, {field: 'surname', value: 'Smith'}]},
          {itemTitle: 'Steve', fields: [{field: 'firstName', value: 'Steve'}, {field: 'surname', value: 'Adams'}]},
          {itemTitle: 'Jane', fields: [{field: 'firstName', value: 'Jane'}, {field: 'surname', value: 'Doe'}]}
        ]);

        req.sessionModel.set('firstName', 'Sam');
        req.sessionModel.set('surname', 'Baker');

        behaviour.getValues(req, res, next);
      });

      it('adds a new item when no fields are provided but new fields are present in the source step', () => {
        const addedElement = req.sessionModel.get('otherNames')[3];

        addedElement.should.be.eql({
          itemTitle: 'Sam',
          fields: [
          {field: 'firstName', value: 'Sam', changeField: undefined, showInSummary: false},
          {field: 'surname', value: 'Baker', changeField: undefined, showInSummary: true},
        ]
        });
      });
    });

    describe('#getNextStep', () => {
      it('should go to the next step if user does not come from summary', () => {
        req.form.options.next = '/next';
        behaviour.getNextStep(req, res).should.eql('/test/next');
      });

      it('should return to the confirm step if user comes from summary', () => {
        req.sessionModel.set('returnToSummary', true);
        behaviour.getNextStep(req, res).should.eql('/test/confirm');
        getNextStepStub.should.not.be.called;
      });
    });
  });
});

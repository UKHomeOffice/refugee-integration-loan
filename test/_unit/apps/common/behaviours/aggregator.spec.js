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

  describe('#getValues', () => {
    beforeEach(() => {
      req = request();
      res = response();

      req.sessionModel = new Model({});

      Behaviour = AggregatorBehaviour(Base);
      behaviour = new Behaviour();
    });

    it('redirects to source step if no new data is provided and no elements are present', () => {

    });

    it('calls super and returns if no new data is provided and new elements are present', () => {

    });

    describe('delete item', () => {
      beforeEach(() => {

      });

      it('calls deleteItem when the action is delete and an id is provided', () => {
      });

      it('deletes the item with the given id when the action is delete and an id is provide', () => {
      });
    });

    describe('edit item', () => {
      beforeEach(() => {

      });

      it('calls editItem when the action is edit and an id is provided', () => {
      });

      it('populates the source form fields when the action is edit and an id is provided', () => {
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

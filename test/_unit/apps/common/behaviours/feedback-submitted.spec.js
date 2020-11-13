'use strict';

let request = require('../../../../helpers/request');
let response = require('../../../../helpers/response');
let FeedbackSubmittedBehaviour = require('../../../../../apps/common/behaviours/feedback-submitted');
const Model = require('hof-model');

describe('feedback submitted behaviour', () => {
  class Base {}

  let behaviour;
  let Behaviour;
  let req;
  let res;
  let next;

  describe('#getValues', () => {
    let superGetValuesStub;

    beforeEach(() => {
      req = request();
      res = response();

      req.sessionModel = new Model({
        'feedbackName': 'test',
        'feedbackEmail': 'test',
        'feedbackProcess': 'test',
        'feedbackPath': 'test',
        'feedbackText': 'test'
      });

      superGetValuesStub = sinon.stub();
      Base.prototype.getValues = superGetValuesStub;
      next = sinon.stub();

      Behaviour = FeedbackSubmittedBehaviour(Base);
      behaviour = new Behaviour();

      behaviour.getValues(req, res, next);
    });

    it('session model feedback variables should be unset', () => {
      req.sessionModel.attributes.should.be.empty;
    });

    it('should call the superclass', () => {
      superGetValuesStub.should.be.calledOnceWithExactly(req, res, next);
    });
  });

  describe('#successHandler', () => {
    let redirectStub;

    beforeEach(() => {
      req = request();
      res = response();

      req.sessionModel = new Model({
        'feedbackReferer': '/test'
      });

      req.get.withArgs('origin').returns('example.org');

      redirectStub = sinon.stub();
      res.redirect = redirectStub;

      Behaviour = FeedbackSubmittedBehaviour(Base);
      behaviour = new Behaviour();

      behaviour.successHandler(req, res);

    });

    it('redirects to feedbackReferer if it is set', () => {
      redirectStub.should.be.calledOnceWithExactly('/test');
    });

    it('unsets feedbackRefer', () => {
      req.sessionModel.attributes.should.be.empty;
    });

    it('redirects to /apply if the feedbackRefer is missing', () => {
      req.sessionModel.attributes = {};
      redirectStub.reset();
      behaviour.successHandler(req, res);

      redirectStub.should.be.calledOnceWithExactly('example.org/apply');
    });
  });
});

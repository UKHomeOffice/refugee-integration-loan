'use strict';

const Behaviour = require('../../../../../apps/apply/behaviours/set-radio-button-error-link');

describe('Set radio button error link behaviour', () => {
  let SetRadioButtonErrorLink;
  let testInstance;
  let nextStub;
  const req = {};
  const res = {};

  describe('getValues', () => {
    class Base {
      errorHandler() {}
    }

    beforeEach(() => {
      SetRadioButtonErrorLink = Behaviour(Base);
      testInstance = new SetRadioButtonErrorLink();

      nextStub = sinon.stub();
    });

    it('should set the error radioKey to \'fieldName-yes\' if the error field is a radio button', () => {
      const err = {
        previouslyApplied: {
          key: 'previouslyApplied'
        }
      };

      const expected = {
        previouslyApplied: {
          key: 'previouslyApplied',
          radioKey: 'previouslyApplied-yes'
        }
      };

      testInstance.errorHandler(err, req, res, nextStub);
      expect(err).to.deep.equal(expected);
    });

    it('should not set the radioKey if the error field is not a radio button', () => {
      const err = {
        fullName: {
          key: 'fullName'
        }
      };

      const expected = {
        fullName: {
          key: 'fullName'
        }
      };

      testInstance.errorHandler(err, req, res, nextStub);
      expect(err).to.deep.equal(expected);
    });
  });
});

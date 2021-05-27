'use strict';

const Behaviour = require('../../../../../apps/common/behaviours/set-date-error-link');

describe('Set date error link behaviour', () => {
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

    it('should set the error radioKey to \'fieldName-day\' if the error field is a date component', () => {
      const err = {
        dateOfBirth: {
          key: 'dateOfBirth'
        }
      };

      const expected = {
        dateOfBirth: {
          key: 'dateOfBirth',
          dobKey: 'dateOfBirth-day'
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

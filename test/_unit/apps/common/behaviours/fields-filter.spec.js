
const FieldsFilter = require('../../../../../apps/common/behaviours/fields-filter');

describe('Fields filter behaviour', () => {
  describe('locals', () => {
    class Base {}

    let behaviour;
    let Behaviour;
    let superLocalsStub;
    let req;
    let otherReq;
    let res;
    let next;
    let resetStub;
    let result;

    beforeEach(() => {
      resetStub = sinon.stub();
      req = request();
      req.path = '/not-confirm-step';
      req.sessionModel.reset = resetStub;
      req.form.options = {
        fields: {
          contactTypes: {
            mixin: 'checkbox-group',
            options: [[{}], [{}]],
            validate: 'required',
            legend: { className: 'visuallyhidden' }
          },
          email: {
            validate: ['required', 'email'],
            dependent: { field: 'contactTypes', value: 'email' }
          },
          phone: {
            validate: ['required', 'ukmobilephone'],
            dependent: { field: 'contactTypes', value: 'phone' }
          }
        }
      };

      otherReq = request();
      otherReq.path = '/confirm';
      res = response();
      next = sinon.stub();

      superLocalsStub = sinon.stub().returns({
        fields: [
          {
            mixin: 'checkbox-group',
            options: [[{}], [{}]],
            validate: 'required',
            legend: { className: 'visuallyhidden' },
            key: 'contactTypes'
          },
          {
            validate: ['required', 'email'],
            dependent: { field: 'contactTypes', value: 'email' },
            key: 'email'
          },
          {
            validate: ['required', 'phone'],
            dependent: { field: 'contactTypes', value: 'phone' },
            key: 'phone'
          }
        ]
      });

      Base.prototype.locals = superLocalsStub;
      Behaviour = FieldsFilter(Base);
      behaviour = new Behaviour();
      behaviour.options = {
        next: '/next',
        steps: {
          '/confirm': {
          }
        }
      };

      result = behaviour.locals(req, res, next);
    });

    it('should call super locals once', () => {
      superLocalsStub.should.have.been.calledOnce.calledWithExactly(req, res);
    });

    it('should return a mixin', () => {
      expect(behaviour).to.be.an.instanceOf(Base);
    });

    it('Returns fields with no dependents', () => {
      expect(result).to.eql({ fields: [{
        mixin: 'checkbox-group',
        options: [[{}], [{}]],
        validate: 'required',
        legend: { className: 'visuallyhidden' },
        key: 'contactTypes'
      }]});
    });
  });
});

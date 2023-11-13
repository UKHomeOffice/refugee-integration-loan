const AddSpacePostcodeBehaviour = require('../../../../../apps/apply/behaviours/add-space-postcode');

describe('#process', () => {
  let behaviour;
  let Behaviour;
  let superProcessStub;
  let req;
  let res;
  let next;

  const formValuesSevenChars = {
    postcode: 'SW159GQ'
  };

  const formValuesSixChars = {
    postcode: 'SR77ND'
  };

  const formValuesFiveChars = {
    postcode: 'M11JA'
  };

  class Base {}

  beforeEach(() => {
    req = request();
    res = response();
    next = sinon.stub();
    superProcessStub = sinon.stub();

    Base.prototype.process = superProcessStub;

    Behaviour = AddSpacePostcodeBehaviour;
    Behaviour = Behaviour(Base);
    behaviour = new Behaviour();
  });

  describe('initialisation', () => {
    it('should be an instance', () => {
      expect(behaviour).to.be.an.instanceOf(Base);
    });
    it('add space to postcode if the postcode is 7 characters', () => {
      req.form.values = formValuesSevenChars;
      behaviour.process(req, res, next);
      expect(req.form.values.postcode).to.eq('SW15 9GQ');
    });
    it('add space to postcode if the postcode is 6 characters', () => {
      req.form.values = formValuesSixChars;
      behaviour.process(req, res, next);
      expect(req.form.values.postcode).to.eq('SR7 7ND');
    });
    it('add space to postcode if the postcode is 5 characters', () => {
      req.form.values = formValuesFiveChars;
      behaviour.process(req, res, next);
      expect(req.form.values.postcode).to.eq('M1 1JA');
    });
  });
});

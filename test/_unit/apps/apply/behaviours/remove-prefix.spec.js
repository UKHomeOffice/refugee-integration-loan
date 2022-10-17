const removePrefixBehaviour = require('../../../../../apps/apply/behaviours/remove-prefix');

describe('#process', () => {
  let behaviour;
  let Behaviour;
  let superProcessStub;
  let req;
  let res;
  let next;

  const formValues = {
    incomeTypes: [ 'salary', 'universal_credit', 'child_benefit' ],
    salaryAmount: '£100',
    universalCreditAmount: '££200',
    childBenefitAmount: '£150£'
  };

  class Base {}

  beforeEach(() => {
    req = request();
    res = response();
    next = sinon.stub();
    superProcessStub = sinon.stub();

    Base.prototype.process = superProcessStub;

    Behaviour = removePrefixBehaviour;
    Behaviour = Behaviour(Base);
    behaviour = new Behaviour();
  });

  describe('initialisation', () => {
    it('returns a thing', () => {
      expect(behaviour).to.be.an.instanceOf(Base);
    });
    it('should call super.process', () => {
      behaviour.process(req, res, next);
      superProcessStub.should.be.calledOnce;
    });
    it('removes prefix', () => {
      req.form.values = formValues;
      behaviour.process(req, res, next);
      expect(req.form.values.salaryAmount).to.eq('100');
      expect(req.form.values.universalCreditAmount).to.eq('200');
      expect(req.form.values.childBenefitAmount).to.eq('150');
    });
  });
});

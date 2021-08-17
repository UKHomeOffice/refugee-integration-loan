
describe('Accept Upload PDF Behaviour', () => {
  let behaviour;
  let Behaviour;
  let pdfBaseStub;
  let pdfBaseInstanceStub;
  let sendStub;
  let superStub;
  let superLocalsStub;
  let req;
  let res;

  const pdfConfig = {
    app: 'accept',
    component: 'acceptance',
    sendReceipt: true,
    sortSections: false,
    notifyPersonalisations: {
      'loan reference': '12345'
    }
  };

  class Base {}

  beforeEach(() => {
    pdfBaseStub = sinon.stub();
    sendStub = sinon.stub();
    superStub = sinon.stub();
    superLocalsStub = sinon.stub();

    superLocalsStub.returns({ superlocals: 'superlocals' });

    pdfBaseInstanceStub = {
      send: sendStub
    };

    pdfBaseStub.withArgs(pdfConfig).returns(pdfBaseInstanceStub);

    Base.prototype.locals = superLocalsStub;
    Base.prototype.successHandler = superStub;

    Behaviour = proxyquire('../apps/accept/behaviours/upload-pdf', {
      '../../common/behaviours/upload-pdf-base': pdfBaseStub
    });

    Behaviour = Behaviour(Base);

    behaviour = new Behaviour();
  });

  describe('initialisation', () => {
    it('returns a mixin', () => {
      expect(behaviour).to.be.an.instanceOf(Base);
    });
  });

  describe('#successHandler', () => {
    beforeEach(async () => {
      req = request();
      res = response();

      req.sessionModel.set('loanReference', pdfConfig.notifyPersonalisations['loan reference']);

      await behaviour.successHandler(req, res, () => {});
    });

    it('creates an instance of the base PDF behaviour and uses config with loan reference', () => {
      pdfBaseStub.should.have.been.calledOnce.calledWithExactly(pdfConfig);
    });

    it('calls the send method of the pdf instance once', () => {
      sendStub.should.have.been.calledOnce.calledWithExactly(req, res, { superlocals: 'superlocals' });
    });
  });
});

'use strict';

const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');

describe('Accept Upload PDF Behaviour', () => {
  let behaviour;
  let Behaviour;
  let pdfBaseStub;
  let renderHTMLStub;
  let createPDFStub;
  let sendEmailWithAttachmentStub;
  let registerStub;
  let incStub;
  let superStub;
  let superLocalsStub;
  let req;
  let res;

  const pdfConfig = {
    app: 'accept',
    component: 'acceptance',
    sendReceipt: false,
    sortSections: false,
    notifyPersonalisations: {
      'loan reference': '12345'
    }
  };
  const testHTMLString = '<html>Test HTML</html>';
  const testPDFFilePath = 'temp_file.pdf';

  class Base {}

  beforeEach(() => {
    registerStub = sinon.stub();
    pdfBaseStub = sinon.stub();
    renderHTMLStub = sinon.stub();
    createPDFStub = sinon.stub();
    sendEmailWithAttachmentStub = sinon.stub();
    incStub = sinon.stub();
    superStub = sinon.stub();
    superLocalsStub = sinon.stub();

    registerStub.withArgs('ril_acceptance_errors_gauge').returns({ inc: incStub });
    renderHTMLStub.resolves(testHTMLString);
    createPDFStub.resolves(testPDFFilePath);
    superLocalsStub.returns({ superlocals: 'superlocals' });

    pdfBaseStub.withArgs(pdfConfig).returns({
      renderHTML: renderHTMLStub,
      createPDF: createPDFStub,
      sendEmailWithAttachment: sendEmailWithAttachmentStub
    });

    Base.prototype.locals = superLocalsStub;
    Base.prototype.successHandler = superStub;

    Behaviour = proxyquire('../apps/accept/behaviours/upload-pdf', {
      '../../common/behaviours/upload-pdf-base': pdfBaseStub,
      'prom-client': { register: { getSingleMetric: registerStub } }
    });

    Behaviour = Behaviour(Base);

    behaviour = new Behaviour();
  });

  describe('initialisation', () => {
    it('returns a mixin', () => {
      expect(behaviour).to.be.an.instanceOf(Base);
    });
  });

  describe('#pdfLocals', () => {
    let result;

    beforeEach(() => {
      req = request();
      res = response();

      req.form = { options: { sections: {}, pdfSections: 'pdfSections' } };
      result = behaviour.pdfLocals(req, res);
    });

    it('should call super locals once', () => {
      superLocalsStub.should.have.been.calledOnce.calledWithExactly(req, res);
    });

    it('returns super locals', () => {
      expect(result).to.eql({ superlocals: 'superlocals' });
    });
  });

  describe('#successHandler', () => {
    let badReq;
    let sandbox;
    let BehaviourStub;

    beforeEach(async() => {
      req = request();
      res = response();
      badReq = request();
      badReq.sessionID = 'bad';

      req.sessionModel.set('loanReference', pdfConfig.notifyPersonalisations['loan reference']);
      renderHTMLStub.withArgs(badReq, res, { fakeLocals: 'badLocals' }).rejects('LocalsError');

      sandbox = sinon.createSandbox();
      const pdfLocalsStub = sandbox.stub(Behaviour.prototype, 'pdfLocals');

      pdfLocalsStub.withArgs(req, res).returns({ fakeLocals: 'fakeLocals' });
      pdfLocalsStub.withArgs(badReq, res).returns({ fakeLocals: 'badLocals' });

      BehaviourStub = pdfLocalsStub;

      await behaviour.successHandler(req, res, sinon.stub());
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('creates an instance of the base PDF behaviour and uses config with loan reference', () => {
      pdfBaseStub.should.have.been.calledOnce.calledWithExactly(pdfConfig);
    });

    it('calls pdfLocals method once', () => {
      BehaviourStub.should.have.been.calledOnce.calledWithExactly(req, res);
    });

    it('calls the renderHTML method of the pdf instance once', () => {
      renderHTMLStub.should.have.been.calledOnce.calledWithExactly(req, res, { fakeLocals: 'fakeLocals' });
    });

    it('calls the createPDF method of the pdf instance once', () => {
      createPDFStub.should.have.been.calledOnce.calledWithExactly(req, testHTMLString);
    });

    it('calls the sendEmailWithAttachment method of the pdf instance once', () => {
      sendEmailWithAttachmentStub.should.have.been.calledOnce.calledWithExactly(req, testPDFFilePath);
    });

    it('should not call the registry error gauge if there is no error', () => {
      registerStub.should.not.have.been.called;
      incStub.should.not.have.been.called;
    });

    it('should call the registry error gauge if there is an error', async() => {
      await behaviour.successHandler(badReq, res, sinon.stub());
      registerStub.should.have.been.calledOnce.calledWithExactly('ril_acceptance_errors_gauge');
      incStub.should.have.been.calledOnce.calledWithExactly({ component: 'acceptance-form-submission' }, 1.0);
    });

    it('should call the callback with an Error if there is an error', async() => {
      const next = sinon.stub();
      await behaviour.successHandler(badReq, res, next);

      const errArg = next.firstCall.args[0];
      next.should.have.been.calledOnce;
      expect(errArg).to.be.instanceof(Error);
      expect(errArg.message).to.equal('There was an error sending your loan acceptance form');
    });
  });
});

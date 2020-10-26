'use strict';

const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');

describe('Apply Upload PDF Behaviour', () => {
  let behaviour;
  let Behaviour;
  let pdfBaseStub;
  let renderHTMLStub;
  let createPDFStub;
  let sendEmailWithAttachmentStub;
  let registerStub;
  let incStub;
  let superStub;

  const pdfConfig = {
    app: 'apply',
    component: 'application',
    sendReceipt: true,
    sortSections: true,
    notifyPersonalisations: {
      name: 'Joe Bloggs'
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

    registerStub.withArgs('ril_application_errors_gauge').returns({ inc: incStub });
    renderHTMLStub.resolves(testHTMLString);
    createPDFStub.resolves(testPDFFilePath);

    pdfBaseStub.withArgs(pdfConfig).returns({
      renderHTML: renderHTMLStub,
      createPDF: createPDFStub,
      sendEmailWithAttachment: sendEmailWithAttachmentStub
    });

    Base.prototype.successHandler = superStub;

    Behaviour = proxyquire('../apps/apply/behaviours/upload-pdf', {
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

  describe('#successHandler', async() => {
    let req;
    let res;
    let badReq;
    let sandbox;
    let BehaviourStub;

    beforeEach(async() => {
      req = request();
      res = response();
      badReq = request();
      badReq.sessionID = 'bad';

      req.sessionModel.set('fullName', pdfConfig.notifyPersonalisations.name);
      renderHTMLStub.withArgs(badReq, res, { fakeLocals: 'badLocals' }).rejects('LocalsError');

      sandbox = sinon.createSandbox();
      const superLocalsStub = sandbox.stub(Behaviour.prototype, 'pdfLocals');

      superLocalsStub.withArgs(req, res).returns({ fakeLocals: 'fakeLocals' });
      superLocalsStub.withArgs(badReq, res).returns({ fakeLocals: 'badLocals' });

      BehaviourStub = superLocalsStub;

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
      registerStub.should.have.been.calledOnce.calledWithExactly('ril_application_errors_gauge');
      incStub.should.have.been.calledOnce.calledWithExactly({ component: 'application-form-submission' }, 1.0);
    });

    it('should call the callback with an Error if there is an error', async() => {
      const next = sinon.stub();
      await behaviour.successHandler(badReq, res, next);

      const errArg = next.firstCall.args[0];
      next.should.have.been.calledOnce;
      expect(errArg).to.be.instanceof(Error);
      expect(errArg.message).to.equal('There was an error sending your loan application form');
    });
  });
});

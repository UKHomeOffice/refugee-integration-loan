
const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');
const config = require('../../../../../config');
const moment = require('moment');

const confirmStep = config.routes.confirmStep;

describe('Accept Upload PDF Behaviour', () => {
  let behaviour;
  let Behaviour;
  let pdfBaseStub;
  let pdfBaseInstanceStub;
  let renderHTMLStub;
  let createPDFStub;
  let sendEmailWithAttachmentStub;
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
  const testHTMLString = '<html>Test HTML</html>';
  const testPDFFilePath = 'temp_file.pdf';

  class Base {}

  beforeEach(() => {
    pdfBaseStub = sinon.stub();
    renderHTMLStub = sinon.stub();
    createPDFStub = sinon.stub();
    sendEmailWithAttachmentStub = sinon.stub();
    superStub = sinon.stub();
    superLocalsStub = sinon.stub();

    renderHTMLStub.resolves(testHTMLString);
    createPDFStub.resolves(testPDFFilePath);
    superLocalsStub.returns({ superlocals: 'superlocals' });

    pdfBaseInstanceStub = {
      renderHTML: renderHTMLStub,
      createPDF: createPDFStub,
      sendEmailWithAttachment: sendEmailWithAttachmentStub
    };

    pdfBaseStub.withArgs(pdfConfig).returns(pdfBaseInstanceStub);

    Base.prototype.locals = superLocalsStub;
    Base.prototype.successHandler = superStub;

    Behaviour = proxyquire('../apps/accept/behaviours/upload-pdf', {
      '../../common/behaviours/upload-pdf-base': pdfBaseStub
    });

    Behaviour = Behaviour(Base);

    behaviour = new Behaviour();

    behaviour.options = {
      steps: {
        [confirmStep]: {
          uploadPdfShared: false,
          submitted: false
        }
      }
    };
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

  describe('#sleep', () => {
    it('creates a timed delay', async () => {
      const then = moment();
      await behaviour.sleep(200);
      const diffTo100Mills = Math.round((moment() - then) / 100) * 100;
      expect(diffTo100Mills).to.eql(200);
    });
  });

  describe('#pollPdf', () => {
    let sandbox;
    let sleepStub;
    let next;

    beforeEach(async () => {
      next = sinon.stub();
      sandbox = sinon.createSandbox();
      sleepStub = sandbox.stub(Behaviour.prototype, 'sleep');
      sleepStub.resolves();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should call super successHandler if submitted set to true', async () => {
      behaviour.options.steps[confirmStep].submitted = true;
      await behaviour.pollPdf(req, res, next, 0);
      superStub.should.have.been.calledOnce.calledWithExactly(req, res, next);
    });

    it('should not call anything after 5 tries', () => {
      behaviour.pollPdf(req, res, next, 6)
        .catch(() => {
          sleepStub.should.have.not.been.called;
          superStub.should.have.not.been.called;
        });
    });

    it('should fail with error after 5 tries', () => {
      behaviour.pollPdf(req, res, next, 6)
        .catch(err => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.equal('Error in generating/sending pdf!');
        });
    });

    it('calls the sleep function at 2 second intervals 6 times until fail', () => {
      behaviour.pollPdf(req, res, next, 0)
        .catch(() => {
          expect(sleepStub.callCount).to.eql(6);
          sleepStub.should.have.been.calledWithExactly(2000);
        });
    });
  });

  describe('#successHandler', () => {
    let badReq;
    let sandbox;
    let pdfPollStub;
    let pdfLocalsStub;
    let next;

    beforeEach(async () => {
      req = request();
      res = response();
      next = sinon.stub();
      badReq = request();
      badReq.sessionID = 'bad';

      req.sessionModel.set('loanReference', pdfConfig.notifyPersonalisations['loan reference']);

      sandbox = sinon.createSandbox();
      pdfLocalsStub = sandbox.stub(Behaviour.prototype, 'pdfLocals');
      pdfPollStub = sandbox.stub(Behaviour.prototype, 'pollPdf');

      pdfLocalsStub.withArgs(req, res).returns({ fakeLocals: 'fakeLocals' });
      pdfLocalsStub.withArgs(badReq, res).returns({ fakeLocals: 'badLocals' });
      pdfPollStub.resolves();
      pdfPollStub.withArgs(badReq, res, next, 0).rejects('PollError');

      await behaviour.successHandler(req, res, next);
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('creates an instance of the base PDF behaviour and uses config with loan reference', () => {
      pdfBaseStub.should.have.been.calledOnce.calledWithExactly(pdfConfig);
    });

    it('calls pdfLocals method once', () => {
      pdfLocalsStub.should.have.been.calledOnce.calledWithExactly(req, res);
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

    it('sets uploadPdfShared to pdf base instance and submitted to true', async () => {
      const confirmOptions = behaviour.options.steps[confirmStep];
      expect(confirmOptions.uploadPdfShared).to.eql(pdfBaseInstanceStub);
      expect(confirmOptions.submitted).to.be.true;
    });

    it('calls pollPdf when method invoked multiple times', async () => {
      await behaviour.successHandler(req, res, next);
      await behaviour.successHandler(req, res, next);
      pdfPollStub.should.have.been.calledTwice.calledWithExactly(req, res, next, 0);
    });

    it('should call the callback with an Error if there is an error', async () => {
      behaviour.options.steps[confirmStep] = {
        uploadPdfShared: true
      };

      await behaviour.successHandler(badReq, res, next);

      const errArg = next.firstCall.args[0];
      next.should.have.been.calledOnce;
      expect(errArg).to.be.instanceof(Error);
      expect(errArg.name).to.equal('PollError');
    });
  });
});

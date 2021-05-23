
const { expect } = require('chai');
const request = require('../../../../helpers/request');

describe('pdf-puppeteer', () => {
  describe('generate', () => {
    let launchStub;
    let newPageStub;
    let setContentStub;
    let emulateMediaTypeStub;
    let pdfStub;
    let pdfPuppeteerProxy;
    let closeStub;
    let req;

    const puppetLaunchArgs = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--export-tagged-pdf']
    };

    const testHtml = '<html></html>';
    const badHtml = '<p></p>';
    const testDestination = '.';
    const testTempName = 'Test.pdf';
    const testApplication = 'apply';

    beforeEach(async () => {
      req = request();
      closeStub = sinon.stub();
      pdfStub = sinon.stub();
      emulateMediaTypeStub = sinon.stub();
      setContentStub = sinon.stub();
      newPageStub = sinon.stub();
      launchStub = sinon.stub();

      launchStub.withArgs(puppetLaunchArgs).resolves({
        newPage: newPageStub,
        close: closeStub});

      setContentStub.withArgs(badHtml, {
        waitUntil: 'networkidle0'
      }).rejects(new Error('error'));

      newPageStub.resolves({
        setContent: setContentStub,
        emulateMediaType: emulateMediaTypeStub,
        pdf: pdfStub
      });

      pdfPuppeteerProxy = proxyquire('../apps/common/behaviours/pdf-puppeteer', {
        puppeteer: {
          launch: launchStub
        }
      });

      await pdfPuppeteerProxy.generate(req, testHtml, testDestination, testTempName, testApplication);
    });

    afterEach(() => {
      sinon.restore();
    });

    it('calls puppeteer.launch', () => {
      launchStub.should.have.been.calledOnce.calledWithExactly(puppetLaunchArgs);
    });

    it('calls newPage', () => {
      newPageStub.should.have.been.calledOnce;
    });

    it('calls setContent', () => {
      setContentStub.should.have.been.calledOnce.calledWithExactly(testHtml, {
        waitUntil: 'networkidle0'
      });
    });

    it('calls emulateMediaType', () => {
      emulateMediaTypeStub.should.have.been.calledOnce.calledWithExactly('screen');
    });

    it('calls pdf', () => {
      pdfStub.should.have.been.calledOnce.calledWithExactly({
        path: `${testDestination}/${testTempName}`,
        format: 'A4',
        printBackground: true
      });
    });

    it('calls close', () => {
      closeStub.should.have.been.calledOnce;
    });

    it('returns file', async () => {
      const testFile = await pdfPuppeteerProxy.generate(req, testHtml, testDestination, testTempName, testApplication);
      expect(testFile).to.eql(`${testDestination}/${testTempName}`);
    });

    it('returns an object containing the error message if function fails', async () => {
      await pdfPuppeteerProxy.generate(req, badHtml, testDestination, testTempName, testApplication)
        .catch(err => {
          expect(err).to.be.instanceof(Error);
          expect(err.message).to.equal('error');
        });
    });
  });
});

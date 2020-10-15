/* eslint-disable max-nested-callbacks */
'use strict';

describe.only('pdf-puppeteer', () => {
  describe('generate', () => {
    let puppeteerStub;
    let launchStub;
    let newPageStub;
    let setContentStub;
    let emulateMediaStub;
    let pdfStub;
    let pdfPuppeteerProxy;
    let closeStub;

    let puppetLaunchArgs = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--export-tagged-pdf']
    };

    const testHtml = '<html></html>';
    const testDestination = '.';
    const testTempName = 'Test.pdf';
    const testApplication = 'apply';

    beforeEach(() => {
      closeStub = sinon.stub();
      pdfStub = sinon.stub();
      emulateMediaStub = sinon.stub();
      setContentStub = sinon.stub();
      newPageStub = sinon.stub();
      launchStub = sinon.stub();

      launchStub.withArgs(puppetLaunchArgs).resolves({
        newPage: newPageStub,
        close: closeStub});

      newPageStub.resolves({
        setContent: setContentStub,
        emulateMedia: emulateMediaStub,
        pdf: pdfStub,
        });

      pdfPuppeteerProxy = proxyquire('../apps/common/behaviours/pdf-puppeteer', {
        puppeteer: {
          launch: launchStub
        }
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it('calls puppeteer.launch', async() => {
      await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication);
      launchStub.should.have.been.calledOnce.calledWithExactly(puppetLaunchArgs);
    });

    it('calls newPage', async() => {
      await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication);
      // eslint-disable-next-line no-unused-expressions
      newPageStub.should.have.been.calledOnce;
    });

    it('calls setContent', async() => {
      await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication);
      setContentStub.should.have.been.calledOnce.calledWithExactly(testHtml, {
        waitUntil: 'networkidle0'
      });
    });

    it('calls emulateMedia', async() => {
      await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication);
      emulateMediaStub.should.have.been.calledOnce.calledWithExactly('screen');
    });

    it('calls pdf', async() => {
      await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication);
      pdfStub.should.have.been.calledOnce.calledWithExactly({
        path: `${testDestination}/${testTempName}`,
        format: 'A4',
        printBackground: true
      });
    });

    it('calls close', async() => {
      await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication);
      // eslint-disable-next-line no-unused-expressions
      closeStub.should.have.been.calledOnce;
    });

    it('returns file', async() => {
      const testFile = await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication);
      expect(testFile).to.eql(`${testDestination}/${testTempName}`);
    })

  });
});

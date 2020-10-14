/* eslint-disable max-nested-callbacks */
'use strict';

describe.only('pdf-puppeteer', () => {
  describe('generate', () => {
    let puppeteerStub;
    let launchStub;
    let newPageStub;
    let setContentStub;
    let emulateMediaStub;
    let pfdStub;
    let pdfPuppeteerProxy;

    let puppetLaunchArgs = {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--export-tagged-pdf']
    };

    const testHtml = '<html></html>';
    const testDestination = '.';
    const testTempName = 'Test.pdf';
    const testApplication = 'apply';

    beforeEach(() => {
      newPageStub = sinon.stub();
      launchStub = sinon.stub();

      launchStub.withArgs(puppetLaunchArgs).resolves({ newPage: newPageStub });

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
      await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication)
      launchStub.should.have.been.calledOnce.calledWithExactly(puppetLaunchArgs);
    });

    it('calls newPage', async() => {
      await pdfPuppeteerProxy.generate(testHtml, testDestination, testTempName, testApplication)
      newPageStub.should.have.been.calledOnce;
    });

  });
});

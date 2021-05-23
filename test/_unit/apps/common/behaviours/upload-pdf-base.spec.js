
const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');

describe('Base Upload PDF Behaviour', () => {
  const mockData = '<html></html>';
  const mockPath = './pdf-form-submissions_test.pdf';


  const getProxyquiredInstance = (overrides, behaviourConfig) => {
    overrides['../translations/src/en/pages.json'] = overrides['../translations/src/en/pages.json'] ||
      { pages: { confirm: { sections: {} } }, '@noCallThru': true };

    const Behaviour = proxyquire('../apps/common/behaviours/upload-pdf-base', overrides);

    const defaults =
      {
        app: 'apply',
        component: 'application',
        sendReceipt: true,
        sessionModelNameKey: 'fullName',
        sortSections: true
      };

    Object.assign(defaults, behaviourConfig);

    return new Behaviour(defaults);
  };

  describe('assorted functions', () => {
    it('createPDF should call pdfPuppeteer.generatePDF', async () => {
      const req = request();

      const pdfPuppeteerMock = { generate: sinon.stub().returns(mockPath) };

      const instance = getProxyquiredInstance(
        {
          '../../common/behaviours/pdf-puppeteer': pdfPuppeteerMock,
          uuid: { v1: sinon.stub().returns('abc123') }
        });

      const result = await instance.createPDF(req, mockData);

      const expectedTempName = 'abc123.pdf';
      result.should.eql(mockPath);
      pdfPuppeteerMock.generate.withArgs(req, mockData, sinon.match.any, expectedTempName, 'apply')
        .calledOnce.should.be.true;
    });

    it('readPdf should read a PDF from the correct path', async () => {
      const fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData))
      };

      const instance = getProxyquiredInstance({ fs: fsMock });

      const result = await instance.readPdf(mockPath);

      result.should.eql(mockData);
      fsMock.readFile.withArgs(mockPath).calledOnce.should.be.true;
    });
  });

  describe('getEmailReceiptTemplateId', () => {
    const configMock = {
      govukNotify: {
        templateEmailReceipt: 'templateEmailReceipt',
        templateAcceptEmailReceipt: 'templateAcceptEmailReceipt',
        notifyApiKey: 'mock-api-key'
      }
    };

    it('should return the correct email template for the apply journey', () => {
      const fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData))
      };

      const instance = getProxyquiredInstance({
        fs: fsMock,
        '../../../config': configMock
      });

      const result = instance.getEmailReceiptTemplateId('apply');

      result.should.equal('templateEmailReceipt');
    });

    it('should return the correct email template for the accept journey', () => {
      const fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData))
      };

      const instance = getProxyquiredInstance({
        fs: fsMock,
        '../../../config': configMock
      });

      const result = instance.getEmailReceiptTemplateId('accept');

      result.should.equal('templateAcceptEmailReceipt');
    });
  });

  describe('getTextReceiptTemplateId', () => {
    const configMock = {
      govukNotify: {
        templateTextReceipt: 'templateTextReceipt',
        templateAcceptTextReceipt: 'templateAcceptTextReceipt',
        notifyApiKey: 'mock-api-key'
      }
    };

    it('should return the correct text template for the apply journey', () => {
      const fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData))
      };

      const instance = getProxyquiredInstance({
        fs: fsMock,
        '../../../config': configMock
      });

      const result = instance.getTextReceiptTemplateId('apply');

      result.should.equal('templateTextReceipt');
    });

    it('should return the correct text template for the accept journey', () => {
      const fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData))
      };

      const instance = getProxyquiredInstance({
        fs: fsMock,
        '../../../config': configMock
      });

      const result = instance.getTextReceiptTemplateId('accept');

      result.should.equal('templateAcceptTextReceipt');
    });
  });

  describe('renderHtml', () => {
    let fsMock;

    afterEach(() => {
      sinon.restore();
    });

    beforeEach(() => {
      fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData))
      };
    });


    it('should send the correct locals and ordered rows to renderHTML', async () => {
      const req = request({ form: { options: {} }, session: {} });
      const res = response({});
      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(null, {});
      }
      );

      const inputRows = [
        {
          section: 'Criminal convictions',
          fields: [
            {
              label: 'Have you ever been convicted of a crime in the UK?'
            }
          ]
        },
        {
          section: 'Applicant’s details'
        }
      ];

      const expectedRows = [
        {
          section: 'Applicant’s details'
        },
        {
          section: 'Criminal convictions',
          fields: [
            {
              label: 'Have you ever been convicted of a crime in the UK?'
            }
          ]
        }
      ];

      const orderedSections = {
        pages: {
          confirm: {
            sections: {
              'pdf-applicant-details': {
                header: 'Applicant’s details'
              },
              'pdf-conviction-details': {
                header: 'Criminal convictions'
              }
            }
          }
        },
        '@noCallThru': true
      };

      const mockLocals = {
        fields: [],
        route: 'confirm',
        baseUrl: '/apply',
        title: 'Check your answers before sending your application',
        intro: null,
        nextPage: '/apply/complete',
        feedbackUrl: '/feedback?f_t=eyJiYXNlVXJsIjoiL2FwcGx5IiwicGF0aCI6Ii9jb25maXJtIiwidXJsIjoiL2FwcGx5L2N' +
          'vbmZpcm0ifQ%3D%3D',
        rows: inputRows
      };

      const instance = getProxyquiredInstance({
        fs: fsMock,
        '../translations/src/en/pages.json': orderedSections
      });

      await instance.renderHTML(req, res, mockLocals);

      res.render.should.be.calledOnce;
      res.render.withArgs('pdf.html', sinon.match.object).should.be.calledOnce;

      const actualLocals = res.render.firstCall.args[1];
      actualLocals.rows.should.eql(expectedRows);
      actualLocals.htmlLang.should.eql('en');
      actualLocals.title.should.eql('Refugee integration loan application');
    });

    it('should call sortSections when sortSections is true ', async () => {
      const req = request({ form: { options: {} }, session: {} });

      const res = response({});

      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(null, {});
      });

      const instance = getProxyquiredInstance({ fs: fsMock });
      instance.sortSections = sinon.stub().callsFake((...args) => args);

      await instance.renderHTML(req, res, () => ({ rows: [] }));

      instance.sortSections.should.be.calledOnce;
    });

    it('should not call sortSections when sortSections is false ', async () => {
      const req = request({ form: { options: {} }, session: {} });

      const res = response({});

      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(null, {});
      });

      const instance = getProxyquiredInstance({ fs: fsMock }, {sortSections: false});
      instance.sortSections = sinon.stub().callsFake((...args) => args);

      await instance.renderHTML(req, res, () => ({ rows: [] }));

      instance.sortSections.should.not.be.calledOnce;
    });

    it('should reject on render error', async () => {
      const req = request({ form: { options: {} }, session: {} });
      const res = response({});
      res.render = sinon.stub().callsFake((template, values, cb) => {
        cb(Error('Error'), null);
      });

      const localsStub = sinon.stub().returns({});
      const instance = getProxyquiredInstance({ fs: fsMock });

      await instance.renderHTML(req, res, localsStub).should.be.rejected;
    });
  });

  describe('sendEmail', () => {
    const configMock = {
      govukNotify: {
        caseworkerEmail: 'mock-case-worker@example.org',
        templateForm: {
          accept: 'template-id',
          apply: 'template-id'
        },
        notifyApiKey: 'mock-api-key'
      }
    };

    afterEach(() => {
      sinon.restore();
    });

    let sendEmailStub;
    let prepareUploadStub;
    let notifyClientMock;
    let fsMock;

    beforeEach(() => {
      sendEmailStub = sinon.stub().callsFake(() => Promise.resolve({}));
      prepareUploadStub = sinon.stub().returns({
        file: 'base64-file',
        is_csv: false
      });

      fsMock = {
        readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData)),
        unlink: sinon.stub().callsFake((p, cb) => cb(null))
      };

      notifyClientMock = {
        NotifyClient: class {
          constructor() {
            this.prepareUpload = prepareUploadStub;
            this.sendEmail = sendEmailStub;

            return this;
          }
        }
      };
    });

    it('should send the correct details to the email service and delete the pdf', async () => {
      const req = request({ session: { fullName: 'Jane Smith' } });
      const emailReceiptTemplateId = 'test';
      const applicantEmail = 'test@example.org';
      const appName = 'testApp';

      const instance = getProxyquiredInstance({
        fs: fsMock,
        '../../../lib/utilities': notifyClientMock,
        '../../../config': configMock
      });

      instance.sendReceipt = sinon.stub().resolves();
      instance.notifyByEmail = sinon.stub().resolves();

      await instance.sendEmailWithAttachment(req, mockPath);

      const expectedEmailContent = {
        personalisation: {
          'form id': {
            file: 'base64-file',
            is_csv: false
          }
        }
      };

      fsMock.readFile.withArgs(mockPath).should.be.calledOnce;
      prepareUploadStub.withArgs(mockData).should.be.calledOnce;

      sendEmailStub.should.be.calledOnceWith(configMock.govukNotify.templateForm.apply,
        configMock.govukNotify.caseworkerEmail,
        expectedEmailContent);

      instance.sendReceipt.withArgs(req).should.be.calledOnce;
      instance.notifyByEmail.withArgs(emailReceiptTemplateId, applicantEmail, appName);

      fsMock.unlink.calledOnce.should.be.true;
    });

    it('should reject on send email error', async () => {
      sendEmailStub.callsFake(() => Promise.reject({}));

      const req = request({ session: { 'session.started.timestamp': '7357' } });

      const instance = getProxyquiredInstance({
        fs: fsMock,
        '../../../lib/utilities': notifyClientMock,
        '../../../config': configMock
      });

      await instance.sendEmailWithAttachment(req, mockPath).should.be.rejected;
    });
  });
});

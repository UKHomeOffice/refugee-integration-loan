/* eslint-disable no-unused-expressions,max-nested-callbacks */
'use strict';

// const Behaviour = require('../../../../../apps/apply/behaviours/upload-pdf.js');
const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');

const getProxyquireMixinInstance = (overrides, base) => {
    class DefaultBase {
    }

    overrides['../../../lib/logger'] = { info: sinon.stub(), error: sinon.stub() };

    overrides['../translations/en/default.json'] = overrides['../translations/en/default.json'] ||
        { pages: { confirm: { sections: {} } }, '@noCallThru': true };

    const behaviour = proxyquire('../apps/apply/behaviours/upload-pdf', overrides);

    const Mixed = behaviour(base ? base : DefaultBase);
    return new Mixed();
};

describe('apply Upload PDF Behaviour', () => {
    const mockData = '<html></html>';
    const mockPath = './pdf-form-submissions_test.pdf';

    it('exports a function', () => {
        expect(proxyquire('../apps/apply/behaviours/upload-pdf',
            { '../translations/en/default.json': { pages: { confirm: { sections: {} } }, '@noCallThru': true } }
        )).to.be.a('function');
    });


    describe('initialisation', () => {
        it('returns a mixin', () => {
            class Base {
            }

            const proxiedBehaviour = proxyquire('../apps/apply/behaviours/upload-pdf',
                { '../translations/en/default.json': { pages: { confirm: { sections: {} } }, '@noCallThru': true } }
            );

            const Mixed = proxiedBehaviour(Base);
            expect(new Mixed()).to.be.an.instanceOf(Base);
        });
    });

    describe('assorted functions', () => {
        it('createPDF should call pdfPuppeteer.generatePDF', async() => {
            const req = request();

            const pdfPuppeteerMock = { generate: sinon.stub().returns(mockPath) };

            const instance = getProxyquireMixinInstance(
                {
                    '../../common/behaviours/util/pdf-puppeteer': pdfPuppeteerMock,
                    'uuid': { v1: sinon.stub().returns('abc123') }
                });

            const result = await instance.createPDF(req, mockData);

            const expectedTempName = 'abc123.pdf';
            result.should.eql(mockPath);
            pdfPuppeteerMock.generate.withArgs(mockData, sinon.match.any, expectedTempName, 'apply')
                .calledOnce.should.be.true;
        });

        it('readPdf should read a PDF from the correct path', async() => {
            const fsMock = {
                readFile: sinon.stub().callsFake((p, cb) => cb(null, mockData)),
            };

            const instance = getProxyquireMixinInstance({ 'fs': fsMock });

            const result = await instance.readPdf(mockPath);

            result.should.eql(mockData);
            fsMock.readFile.withArgs(mockPath).calledOnce.should.be.true;
        });
    });

    describe('sendEmail', () => {
        const configMock = {
            govukNotify: {
                caseworkerEmail: 'mock-case-worker@example.org',
                templateFormApply: 'template-id',
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
                'file': 'base64-file',
                'is_csv': false
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

        it('should send the correct details to the email service and delete the pdf', async() => {
            const req = request({ session: { fullName: 'Jane Smith' } });

            const promClientMock = { register: { getSingleMetric: sinon.stub().returns({ inc: sinon.stub() }) } };

            const instance = getProxyquireMixinInstance({
                'fs': fsMock,
                'prom-client': promClientMock,
                '../../../lib/utilities': notifyClientMock,
                '../../../config': configMock
            });

            await instance.sendEmailWithAttachment(req, mockPath);

            const expectedEmailContent = {
                personalisation: {
                    'form id': {
                        'file': 'base64-file',
                        'is_csv': false
                    },
                    'name': 'Jane Smith'
                }
            };

            fsMock.readFile.withArgs(mockPath).should.be.calledOnce;
            prepareUploadStub.withArgs(mockData).should.be.calledOnce;

            sendEmailStub.withArgs(configMock.govukNotify.templateFormApply,
                configMock.govukNotify.caseworkerEmail,
                expectedEmailContent).should.be.calledOnce;

            fsMock.unlink.calledOnce.should.be.true;
        });

        it('should increment the duration guage', async() => {
            const req = request({ session: { 'session.started.timestamp': '7357' } });

            const errorsGuageSpy = sinon.spy();
            const durationGuageSpy = sinon.spy();

            const promClientMock = { register: { getSingleMetric: sinon.stub() } };
            promClientMock.register.getSingleMetric.withArgs('ril_application_errors_gauge')
                .returns({ inc: errorsGuageSpy });
            promClientMock.register.getSingleMetric.withArgs('ril_application_form_duration_gauge').returns(
                { inc: durationGuageSpy });

            const instance = getProxyquireMixinInstance({
                'fs': fsMock,
                'prom-client': promClientMock,
                '../../../lib/utilities': notifyClientMock,
                '../../../config': configMock,
                '../../../lib/date-utilities': {
                    secondsBetween: sinon.stub().callsFake(a => a)
                }
            });

            await instance.sendEmailWithAttachment(req, mockPath);

            durationGuageSpy.withArgs(7357).calledOnce.should.be.true;
            errorsGuageSpy.notCalled.should.be.true;
        });

        it('should reject and increment error guage on send email error', async() => {
            sendEmailStub.callsFake(() => Promise.reject({}));

            const req = request({ session: { 'session.started.timestamp': '7357' } });

            const errorsGuageSpy = sinon.spy();
            const promClientMock = { register: { getSingleMetric: sinon.stub() } };
            promClientMock.register.getSingleMetric.withArgs('ril_application_errors_gauge')
                .returns({ inc: errorsGuageSpy });

            const instance = getProxyquireMixinInstance({
                'fs': fsMock,
                'prom-client': promClientMock,
                '../../../lib/utilities': notifyClientMock,
                '../../../config': configMock
            });

            await instance.sendEmailWithAttachment(req, mockPath).should.be.rejected;

            errorsGuageSpy.withArgs({ component: 'application-form-email' }, 1.0).callCount.should.eql(1);
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


        it('should send the correct locals and ordered rows to renderHTML', async() => {
            const req = request({ form: { options: {} }, session: {} });
            const res = response({});
            res.render = sinon.stub().callsFake((template, values, cb) => {
                    cb(null, {});
                }
            );

            const inputRows = [
                {
                    'section': 'Criminal convictions',
                    'fields': [
                        {
                            'label': 'Have you ever been convicted of a crime in the UK?'
                        }
                    ]
                },
                {
                    'section': 'Applicant’s details'
                }
            ];

            const expectedRows = [
                {
                    'section': 'Applicant’s details'
                },
                {
                    'section': 'Criminal convictions',
                    'fields': [
                        {
                            'label': 'Have you ever been convicted of a crime in the UK?'
                        }
                    ]
                }
            ];

            const orderedSections = {
                pages: {
                    confirm: {
                        sections: {
                            'pdf-applicant-det«ils': {
                                'header': 'Applicant’s details'
                            },
                            'pdf-conviction-details': {
                                'header': 'Criminal convictions'
                            }
                        }
                    },
                },
                '@noCallThru': true
            };

            const mockLocals = {
                'fields': [],
                'route': 'confirm',
                'baseUrl': '/apply',
                'title': 'Check your answers before sending your application',
                'intro': null,
                'nextPage': '/apply/complete',
                'feedbackUrl': '/feedback?f_t=eyJiYXNlVXJsIjoiL2FwcGx5IiwicGF0aCI6Ii9jb25maXJtIiwidXJsIjoiL2FwcGx5L2N' +
                    'vbmZpcm0ifQ%3D%3D',
                'rows': inputRows
            };

            const instance = getProxyquireMixinInstance({
                'fs': fsMock,
                '../translations/en/default.json': orderedSections
            }, class {
                // eslint-disable-next-line no-unused-vars,no-shadow
                locals(req, res) {
                    return mockLocals;
                }
            });

            await instance.renderHTML(req, res);

            res.render.should.be.calledOnce;
            res.render.withArgs('pdf.html', sinon.match.object).should.be.calledOnce;

            const actualLocals = res.render.firstCall.args[1];
            actualLocals.rows.should.eql(expectedRows);
            actualLocals.htmlLang.should.eql('en');
            actualLocals.title.should.eql('Refugee integration loan application');
        });

        it('should send the correct request details when getting locals', async() => {
            const req = request({
                form: { options: {} }, session: {
                    'session.started.timestamp': 1602846406310,
                    'previouslyApplied': 'no',
                    'partner': 'no',
                    'brpNumber': 'ZU1234567',
                    'fullName': 'Fake Name',
                    'dateOfBirth': '1920-12-20',
                    'niNumber': 'JS123456C',
                    'hasOtherNames': 'yes',
                    'other-names-items': [
                        {
                            'otherNames': 'Jane Smith'
                        }
                    ],
                }
            });

            const res = response({});
            res.render = sinon.stub().callsFake((template, values, cb) => {
                    cb(null, {});
                }
            );

            const localsStub = sinon.stub().returns({ 'rows': [] });
            const instance = getProxyquireMixinInstance({ 'fs': fsMock }, class {
                locals(...args) {
                    return localsStub(...args);
                }
            });

            await instance.renderHTML(req, res);

            localsStub.withArgs(req).should.be.calledOnce;
        });

        it('should reject on render error', async() => {
            const req = request({ form: { options: {} }, session: {} });
            const res = response({});
            res.render = sinon.stub().callsFake((template, values, cb) => {
                    cb(Error('Error'), null);
                }
            );

            const localsStub = sinon.stub().returns({});
            const instance = getProxyquireMixinInstance({ 'fs': fsMock }, class {
                locals(...args) {
                    return localsStub(...args);
                }
            });

            await instance.renderHTML(req, res).should.be.rejected;
        });
    });

    describe('successHandler', () => {
        it('it should create a pdf from rendered html and send as email', async() => {
            const req = request({ form: { options: {} }, session: {} });
            const res = response({});
            const next = sinon.stub();

            const renderedHtml = '<html></html>';
            const renderedPdf = 'expected.pdf';

            const mixedInSuccessHandler = sinon.stub();

            const instance = getProxyquireMixinInstance({}, class {
                successHandler(...args) {
                    return mixedInSuccessHandler(...args);
                }
            });

            instance.renderHTML = sinon.stub().returns(Promise.resolve(renderedHtml));
            instance.createPDF = sinon.stub().returns(Promise.resolve(renderedPdf));
            instance.sendEmailWithAttachment = sinon.stub().returns(Promise.resolve());

            await instance.successHandler(req, res, next);

            instance.renderHTML.withArgs(req, res).should.be.calledOnce;
            instance.createPDF.withArgs(req, renderedHtml).should.be.calledOnce;
            instance.sendEmailWithAttachment.withArgs(req, renderedPdf).should.be.calledOnce;
            mixedInSuccessHandler.withArgs(req, res, next).should.be.calledOnce;
        });
        it('should call errorGuage on failure', async() => {
            const next = sinon.stub();
            const errorsGuageSpy = sinon.spy();

            const promClientMock = { register: { getSingleMetric: sinon.stub() } };
            promClientMock.register.getSingleMetric.withArgs('ril_application_errors_gauge')
                .returns({ inc: errorsGuageSpy });

            const instance = getProxyquireMixinInstance({ 'prom-client': promClientMock });

            instance.renderHTML = sinon.stub().throws(new Error());

            await instance.successHandler({}, {}, next);

            errorsGuageSpy.withArgs({ component: 'application-form-submission' }, 1.0).should.be.calledOnce;
            next.withArgs(sinon.match.instanceOf(Error)).should.be.calledOnce;
        });
    });
});



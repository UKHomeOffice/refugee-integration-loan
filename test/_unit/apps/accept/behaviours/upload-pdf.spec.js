/* eslint-disable no-unused-expressions,max-nested-callbacks */
'use strict';

const Behaviour = require('../../../../../apps/accept/behaviours/upload-pdf.js');
const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');

const getProxyquireMixinInstance = (overrides, base) => {
    class DefaultBase {
    }

    overrides['../../../lib/logger'] = {info: sinon.stub(), error: sinon.stub()};

    const behaviour = proxyquire('../apps/accept/behaviours/upload-pdf', overrides);

    const Mixed = behaviour(base ? base : DefaultBase);
    return new Mixed();
};

describe('Accept Upload PDF Behaviour', () => {
    const mockData = '<html></html>';
    const mockPath = './pdf-form-submissions_test.pdf';

    it('exports a function', () => {
        expect(Behaviour).to.be.a('function');
    });

    describe('initialisation', () => {
        it('returns a mixin', () => {
            class Base {
            }

            const Mixed = Behaviour(Base);
            expect(new Mixed()).to.be.an.instanceOf(Base);
        });
    });

    describe('assorted functions', () => {
        it('createPDF should call pdfPuppeteer.generatePDF', async() => {
            const req = request();

            const pdfPuppeteerMock = { generate: sinon.stub().returns(mockPath) };

            const instance = getProxyquireMixinInstance(
                {
                    '../../common/behaviours/pdf-puppeteer': pdfPuppeteerMock,
                    'uuid': { v1: sinon.stub().returns('abc123') }
                });

            const result = await instance.createPDF(req, mockData);

            const expectedTempName = 'abc123.pdf';
            result.should.eql(mockPath);
            pdfPuppeteerMock.generate.withArgs(mockData, sinon.match.any, expectedTempName, 'accept')
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
                templateFormAccept: 'template-id',
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
            const req = request({ session: { loanReference: 'mockLoanReference' } });

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
                    'name': 'mockLoanReference'
                }
            };

            fsMock.readFile.withArgs(mockPath).should.be.calledOnce;
            prepareUploadStub.withArgs(mockData).should.be.calledOnce;

            sendEmailStub.withArgs(configMock.govukNotify.templateFormAccept,
                configMock.govukNotify.caseworkerEmail,
                expectedEmailContent).should.be.calledOnce;

            fsMock.unlink.calledOnce.should.be.true;
        });

        it('should increment the duration guage', async() => {
            const req = request({ session: { 'session.started.timestamp': '7357' } });

            const errorsGuageSpy = sinon.spy();
            const durationGuageSpy = sinon.spy();

            const promClientMock = { register: { getSingleMetric: sinon.stub() } };
            promClientMock.register.getSingleMetric.withArgs('ril_acceptance_errors_gauge')
                .returns({ inc: errorsGuageSpy });
            promClientMock.register.getSingleMetric.withArgs('ril_acceptance_form_duration_gauge').returns(
                { inc: durationGuageSpy });

            const instance = getProxyquireMixinInstance({
                'fs': fsMock,
                'prom-client': promClientMock,
                '../../../lib/utilities': notifyClientMock,
                '../../../config': configMock,
                '../../../lib/date-utilities': { secondsBetween: sinon.stub().callsFake(a => a) }
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
            promClientMock.register.getSingleMetric.withArgs('ril_acceptance_errors_gauge')
                .returns({ inc: errorsGuageSpy });

            const instance = getProxyquireMixinInstance({
                'fs': fsMock,
                'prom-client': promClientMock,
                '../../../lib/utilities': notifyClientMock,
                '../../../config': configMock
            });

            await instance.sendEmailWithAttachment(req, mockPath).should.be.rejected;

            errorsGuageSpy.withArgs({ component: 'email' }, 1.0).callCount.should.eql(1);
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


        it('should send the correct locals to renderHTML', async() => {
            const req = request({ form: { options: {} }, session: {} });
            const res = response({});
            res.render = sinon.stub().callsFake((template, values, cb) => {
                    cb(null, {});
                }
            );

            const expectedLocalsRows = [
                {
                    'section': 'pages.confirm.sections.pdf-applicant-details.header',
                    'fields': [
                        {
                            'label': 'Loan reference number',
                            'changeLinkDescription': 'Loan reference number',
                            'value': '12345',
                            'step': '/reference-number',
                            'field': 'loanReference'
                        },
                        {
                            'label': 'Biometric residence permit (BRP) number',
                            'changeLinkDescription': 'Biometric residence permit (BRP) number',
                            'value': 'ZU1234567',
                            'step': '/brp',
                            'field': 'brpNumber'
                        },
                        {
                            'label': 'Date of Birth',
                            'changeLinkDescription': 'Date of Birth',
                            'value': '1st January 1900',
                            'step': '/brp',
                            'field': 'dateOfBirth'
                        }
                    ]
                }
            ];

            const mockLocals = {
                'fields': [],
                'route': 'confirm',
                'baseUrl': '/accept',
                'title': 'Accept your offer',
                'intro': null,
                'nextPage': '/accept/complete-acceptance',
                'feedbackUrl': '/feedback?f_t=eyJiYXNlVXJsIjoiL2FjY2VwdCIsInBhdGgiOiIvY29uZmlybSIsInVybCI6Ii9hY2NlcHQ' +
                    'vY29uZmlybSJ9',
                'rows': expectedLocalsRows
            };

            const instance = getProxyquireMixinInstance({ 'fs': fsMock }, class {
                // eslint-disable-next-line no-unused-vars,no-shadow
                locals(req, res) {
                    return mockLocals;
                }
            });

            await instance.renderHTML(req, res);

            res.render.should.be.calledOnce;
            res.render.withArgs('pdf.html', sinon.match.object).should.be.calledOnce;

            const actualLocals = res.render.firstCall.args[1];
            actualLocals.rows.should.eql(mockLocals.rows);
            actualLocals.htmlLang.should.eql('en');
            actualLocals.title.should.eql('Refugee integration loan acceptance');
        });

        it('should send the correct request details when getting locals', async() => {
            const req = request({
                form: { options: {} }, session: {
                    'csrf-secret': 'zRc1gk2KRlNhaZk2sBcyAMMJ',
                    'session.started.timestamp': 1602671102496,
                    'ril.tracker.page': '/confirm',
                    'ril.tracker.milliseconds': 1602671277998,
                    'errors': null,
                    'loanReference': '12345',
                    'steps': [
                        '/reference-number',
                        '/brp'
                    ],
                    'brpNumber': 'ZU1234567',
                    'dateOfBirth': '1980-02-01'
                }
            });

            const res = response({});
            res.render = sinon.stub().callsFake((template, values, cb) => {
                    cb(null, {});
                }
            );

            const localsStub = sinon.stub().returns({});
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
            promClientMock.register.getSingleMetric.withArgs('ril_acceptance_errors_gauge')
                .returns({ inc: errorsGuageSpy });

            const instance = getProxyquireMixinInstance({ 'prom-client': promClientMock });

            instance.renderHTML = sinon.stub().throws(new Error());

            await instance.successHandler({}, {}, next);

            errorsGuageSpy.withArgs({ component: 'acceptance-form-submission' }, 1.0).should.be.calledOnce;
            next.withArgs(sinon.match.instanceOf(Error)).should.be.calledOnce;
        });
    });
});

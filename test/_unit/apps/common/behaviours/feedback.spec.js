/* eslint-disable max-len */
'use strict';
const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');
const { expect } = require('chai');

describe('Feedback behaviour', () => {
  class Base {}
  let notifyClientMock;
  let behaviour;
  let Behaviour;
  let superGetValuesStub;
  let successHandlerStub;
  let capitalizeStub;
  let sendEmailStub;
  let req;
  let res;
  let next;
  const testTemplate = 'testTemplate';
  const testEmail = 'testEmail';
  const testKey = 'testKey';
  const errorName = 'errorName';
  const testError = {
    message: 'testError'
  };
  let logStub;
  let reqTestName = 'reqtestName';
  let reqTestEmail = 'reqtestEmail';
  let reqTestProcess = 'reqtestProcess';
  let reqTestPath = 'reqtestPath';
  let reqTestFeedback = 'reqtestFeedback';

  beforeEach(() => {
    req = request();
    res = response();
    next = sinon.stub();

    sendEmailStub = sinon.stub();
    sendEmailStub.withArgs(testTemplate, testEmail, {
      personalisation: {
        name: reqTestName,
        email: reqTestEmail,
        nameExists: 'yes',
        emailExists: 'yes',
        process: reqTestProcess,
        path: reqTestPath,
        feedback: reqTestFeedback,
      }
    }).resolves();
    sendEmailStub.withArgs(testTemplate, testEmail, {
      personalisation: {
        name: errorName,
        email: reqTestEmail,
        nameExists: 'yes',
        emailExists: 'yes',
        process: reqTestProcess,
        path: reqTestPath,
        feedback: reqTestFeedback,
      }
    }).rejects(testError);
    capitalizeStub = sinon.stub().returns('Ref1');

    notifyClientMock = class {
        constructor() {
          this.sendEmail = sendEmailStub;
          return this;
        }
      };

    successHandlerStub = sinon.stub();
    superGetValuesStub = sinon.stub();

    const feedbackBehaviourProxy = proxyquire('../apps/common/behaviours/feedback', {
      '../../../lib/utilities': {
        capitalize: capitalizeStub,
        NotifyClient: notifyClientMock
      },
      '../../../config': {
        govukNotify: {
          templateFormFeedback: testTemplate,
          feedbackEmail: testEmail,
          notifyApiKey: testKey
        }
      }
    });
    Base.prototype.getValues = superGetValuesStub;
    Base.prototype.successHandler = successHandlerStub;
    Behaviour = feedbackBehaviourProxy(Base);
    behaviour = new Behaviour();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#getValues', () => {
    beforeEach(() => {
      req.headers = {
        referer: 'http://ril.com/ref1/apply'
      };
    });

    it('should return a mixin', () => {
      behaviour.getValues(req, res, next);
      expect(behaviour).to.be.an.instanceOf(Base);
    });

    it('should call super.getValues with req, res, and next arguments', () => {
      behaviour.getValues(req, res, next);
      superGetValuesStub.should.have.been.calledOnce.calledWith(req, res, next);
    });

    describe('If there is a redirectApp and notRedirectedFromFeedbackPage is true', () => {
      it('feedbackReferer should be the referer url on the req sessionModel', () => {
        behaviour.getValues(req, res, next);
        const refererUrl = new URL(req.headers.referer);
        expect(req.sessionModel.attributes.feedbackReferer).to.eql(refererUrl);
      });

      it('feedbackProcess should be set on the session model as the second item in the url pathway', () => {
        behaviour.getValues(req, res, next);
        expect(req.sessionModel.attributes.feedbackProcess).to.eql('Ref1');
      });

      it('feedbackPath should be set on the session model as the third item in the url pathway', () => {
        behaviour.getValues(req, res, next);
        // eslint-disable-next-line quotes
        expect(req.sessionModel.attributes.feedbackPath).to.eql("'apply'");
      });
    });

    describe('If redirectApp equals feedback', () => {
      it('Does not set feedbackReferer, feedbackProcess and feedbackPath on sessionModel', () => {
        req.headers = {
          referer: 'http://ril.com/feedback/apply'
        };
        behaviour.getValues(req, res, next);
        expect(req.sessionModel.attributes).to.not.have.property('feedbackReferer');
        expect(req.sessionModel.attributes).to.not.have.property('feedbackProcess');
        expect(req.sessionModel.attributes).to.not.have.property('feedbackPath');
      });
    });
  });

  describe('#successHandler', () => {

    beforeEach(() => {
      logStub = sinon.stub();
      req.sessionModel.attributes.feedbackName = reqTestName;
      req.sessionModel.attributes.feedbackEmail = reqTestEmail;
      req.sessionModel.attributes.feedbackProcess = reqTestProcess;
      req.sessionModel.attributes.feedbackPath = reqTestPath;
      req.sessionModel.attributes.feedbackText = reqTestFeedback;
      req.log = logStub;
    });

    it('sendEmail is called with config templateId, emailAddress and personalisation values', async() => {
      await behaviour.successHandler(req, res, next);
      sendEmailStub.should.have.been.calledOnce.calledWith(testTemplate, testEmail, {
        personalisation: {
          name: reqTestName,
          email: reqTestEmail,
          nameExists: 'yes',
          emailExists: 'yes',
          process: reqTestProcess,
          path: reqTestPath,
          feedback: reqTestFeedback
        }
      });
    });

    it('sendEmail is called with default process and path personalisation values if not set', async() => {
      req.sessionModel.attributes.feedbackProcess = undefined;
      req.sessionModel.attributes.feedbackPath = undefined;
      await behaviour.successHandler(req, res, next);
      sendEmailStub.should.have.been.calledOnce.calledWith(testTemplate, testEmail, {
        personalisation: {
          name: reqTestName,
          email: reqTestEmail,
          nameExists: 'yes',
          emailExists: 'yes',
          process: 'Feedback',
          path: '\'feedback\'',
          feedback: reqTestFeedback
        }
      });
    });

    it('sendEmail is called false nameExists and emailExists personalisation values if not set', async() => {
      req.sessionModel.attributes.feedbackName = undefined;
      req.sessionModel.attributes.feedbackEmail = undefined;
      await behaviour.successHandler(req, res, next);
      sendEmailStub.should.have.been.calledOnce.calledWith(testTemplate, testEmail, {
        personalisation: {
          name: undefined,
          email: undefined,
          nameExists: 'no',
          emailExists: 'no',
          process: reqTestProcess,
          path: reqTestPath,
          feedback: reqTestFeedback
        }
      });
    });

    it('should call super.successHandler with req, res, and next arguments', async() => {
      await behaviour.successHandler(req, res, next);
      successHandlerStub.should.have.been.calledOnce.calledWith(req, res, next);
    });

    it('should call req.log once with info message if successful', async() => {
      await behaviour.successHandler(req, res, next);
      logStub.should.have.been.calledOnce.calledWith('info', 'ril.form.feedback.submit_form.successful');
    });

    it('should call req.log once with error message if error', async() => {
      req.sessionModel.attributes.feedbackName = errorName;
      await behaviour.successHandler(req, res, next);
      logStub.should.have.been.calledOnce.calledWith('error', 'ril.form.feedback.submit_form.error', testError.message);
    });

    it('should call next wih error if failed', async() => {
      req.sessionModel.attributes.feedbackName = errorName;
      await behaviour.successHandler(req, res, next);
      next.should.have.been.calledOnce.calledWith(testError);
    });
  });
});


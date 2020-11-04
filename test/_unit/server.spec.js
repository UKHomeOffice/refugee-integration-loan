/* eslint-disable max-nested-callbacks */
'use strict';
const config = require('../../config');
const proxyquire = require('proxyquire').noCallThru();

describe('app', () => {
  let appProxy;
  let hofStub;
  let useStub;
  let behavioursFieldFilterStub;
  let behavioursPageAnalyticsStub;
  let SetFeedbackReturnUrlStub;
  let appsCommonStub;
  let appsApplyStub;
  let appsAcceptStub;
  let hofBehaviourLoopViewsStub;
  let metricsStub;

  beforeEach(() => {
    hofStub = sinon.stub();
    useStub = sinon.stub();
    behavioursFieldFilterStub = sinon.stub();
    behavioursPageAnalyticsStub = sinon.stub();
    SetFeedbackReturnUrlStub = sinon.stub();
    appsCommonStub = sinon.stub();
    appsApplyStub = sinon.stub();
    appsAcceptStub = sinon.stub();
    hofBehaviourLoopViewsStub = sinon.stub();
    metricsStub = sinon.stub().returns('metricStubReturn');

    hofStub.returns({
      use: useStub
    });

  });

  afterEach(() => {
    sinon.restore();
  });

  describe('hof', () => {
    beforeEach(() => {
      appProxy = proxyquire('../../server', {
        'hof': hofStub,
        './lib/metrics': metricsStub,
        './behaviours/fields-filter': behavioursFieldFilterStub,
        './behaviours/page-analytics': behavioursPageAnalyticsStub,
        'hof-behaviour-feedback': {
          SetFeedbackReturnUrl: SetFeedbackReturnUrlStub
        },
        './apps/common': appsCommonStub,
        './apps/apply/': appsApplyStub,
        './apps/accept/': appsAcceptStub,
        'hof-behaviour-loop': {
          views: hofBehaviourLoopViewsStub
        },
      });
    });

    it('calls hof once', () => {
      hofStub.should.have.been.calledOnce;
    });

    it('calls hof with behaviours and routes', () => {
      hofStub.should.have.been.calledWith({
        build: {
          translate: {
            shared: './apps/common/translations/src'
          }
        },
        behaviours: [
          behavioursFieldFilterStub,
          behavioursPageAnalyticsStub,
          SetFeedbackReturnUrlStub
        ],
        routes: [
          appsCommonStub,
          appsApplyStub,
          appsAcceptStub,
        ],
        views: hofBehaviourLoopViewsStub,
        loglevel: config.hofLogLevel
      });
    });
  });

  describe('use', () => {
    let res = {
      locals: {}
    };
    let req;
    let nextStub;
    let testRes;
    let testReq;
    let sendStub;

    beforeEach(() => {
      nextStub = sinon.stub();
      sendStub = sinon.stub();
      useStub.onCall(0).yields(req, res, nextStub);
      testRes = {
        send: sendStub
      };
    });

    it('is called 3 times in the test environment', () => {
      appProxy = proxyquire('../../server', {
        'hof': hofStub
      });

      useStub.should.have.been.calledThrice;
    });

    describe('first call', () => {
      it('should take a callback that sets properties on res then calls next()', () => {
        appProxy = proxyquire('../../server', {
          'hof': hofStub
        });
        res.should.eql({
          locals: {
            htmlLang: 'en',
            feedbackUrl: '/feedback',
            footerSupportLinks: [
              { path: '/cookies', property: 'base.cookies' },
              { path: '/terms-and-conditions', property: 'base.terms' },
              { path: '/accessibility', property: 'base.accessibility' },
            ]
          }
        });
        nextStub.should.have.been.calledOnce;
      });
    });

    describe('second call', () => {
      it('should take /insight and metrics() as arguments', () => {
        appProxy = proxyquire('../../server', {
          'hof': hofStub,
          './lib/metrics': metricsStub,
        });
        const useArgs = useStub.getCall(1).args;
        useArgs.should.eql(['/insight', 'metricStubReturn']);
        metricsStub.should.have.been.calledOnce;
      });
    });

    describe('third call', () => {
      it('it should take /test/bootstrap-session as the first argument', () => {
        appProxy = proxyquire('../../server', {
          'hof': hofStub
        });
        const useArgs = useStub.getCall(2).args[0];
        useArgs.should.eql('/test/bootstrap-session');
      });

      it('the send method on res should be called', () => {
        testReq = {
          session: {
            'hof-wizard-testApp': {}
          },
          body: {
            appName: 'testApp'
          }
        };
        useStub.onCall(2).yields(testReq, testRes);
        appProxy = proxyquire('../../server', {
          'hof': hofStub
        });

        sendStub.should.have.been.calledOnce.calledWith('Session populate complete');
      });

      it('if no app nam key set but a redis session is available set the app name key to an empty object', () => {
        testReq = {
          session: {
            testSession: 'test'
          },
          body: {
            appName: 'testApp'
          }
        };
        useStub.onCall(2).yields(testReq, testRes);
        appProxy = proxyquire('../../server', {
          'hof': hofStub
        });

        testReq.session.should.eql({
          testSession: 'test',
          'hof-wizard-testApp': {}
        });
      });

      it('if session properties are set in the body they are set on hof-wizard-appName', () => {
        testReq = {
          session: {
            'hof-wizard-testApp': {}
          },
          body: {
            appName: 'testApp',
            sessionProperties: {
              testProp1: 'test',
              testProp2: 'test'
            }
          }
        };
        useStub.onCall(2).yields(testReq, testRes);
        appProxy = proxyquire('../../server', {
          'hof': hofStub
        });

        testReq.session['hof-wizard-testApp'].should.eql(
          {
            testProp1: 'test',
            testProp2: 'test'
          }
        );
      });
    });
  });
});

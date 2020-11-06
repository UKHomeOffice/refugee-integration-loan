'use strict';

const path = require('path');
const request = require('../helpers/request');
const response = require('../helpers/response');

describe('Server.js app file', () => {
  let hofStub;
  let useStub;
  let sendStub;
  let behavioursFieldFilterStub;
  let appsCommonStub;
  let appsApplyStub;
  let appsAcceptStub;
  let hofBehaviourLoopViewsStub;
  let behavioursClearSessionStub;
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = request();
    req.session = {};
    req.body = {
      appName: 'testApp',
      sessionProperties: {
        testProp1: 'test',
        testProp2: 'test'
      }
    };

    res = response();
    sendStub = sinon.stub();
    res.send = sendStub;

    next = sinon.stub();
    hofStub = sinon.stub();
    useStub = sinon.stub();
    behavioursFieldFilterStub = sinon.stub();
    appsCommonStub = sinon.stub();
    appsApplyStub = sinon.stub();
    appsAcceptStub = sinon.stub();
    hofBehaviourLoopViewsStub = sinon.stub();
    behavioursClearSessionStub = sinon.stub();

    useStub.onCall(0).yields(req, res, next);
    useStub.onCall(1).yields(req, res);
    hofStub.returns({ use: useStub });

    proxyquire('../server', {
      'hof': hofStub,
      './apps/common/behaviours/clear-session': behavioursClearSessionStub,
      './apps/common/behaviours/fields-filter': behavioursFieldFilterStub,
      './apps/common': appsCommonStub,
      './apps/apply/': appsApplyStub,
      './apps/accept/': appsAcceptStub,
      'hof-behaviour-loop': {
        views: hofBehaviourLoopViewsStub
      },
      './config': { nodeEnv: 'test' }
    });
  });

  describe('Setup HOF Configuration', () => {
    it('calls hof with behaviours and routes', () => {
      hofStub.should.have.been.calledOnce.calledWithExactly({
        behaviours: [
          behavioursClearSessionStub,
          behavioursFieldFilterStub
        ],
        translations: './apps/common/translations',
        routes: [
          appsCommonStub,
          appsApplyStub,
          appsAcceptStub,
        ],
        views: [path.resolve(__dirname, '../../apps/common/views'), hofBehaviourLoopViewsStub]
      });
    });

    it('should call the app use method twice if nodeEnv set to test', () => {
      useStub.should.have.been.calledTwice;
    });

    it('should call the app use method twice if nodeEnv set to development', () => {
      const use = sinon.stub();
      const hof = () => {
        return { use };
      };

      proxyquire('../server', {
        'hof': hof,
        './config': { nodeEnv: 'development' }
      });

      use.should.have.been.calledTwice;
    });

    it('should call the app use method once if nodeEnv set to anything else', () => {
      const use = sinon.stub();
      const hof = () => {
        return { use };
      };

      proxyquire('../server', {
        'hof': hof,
        './config': { nodeEnv: 'production' }
      });

      use.should.have.been.calledOnce;
    });
  });

  describe('Use Locals', () => {
    it('should set locals on the response', () => {
      res.locals.should.eql({
        htmlLang: 'en',
        feedbackUrl: '/feedback',
        footerSupportLinks: [
          { path: '/cookies', property: 'base.cookies' },
          { path: '/terms-and-conditions', property: 'base.terms' },
          { path: '/accessibility', property: 'base.accessibility' },
        ]
      });
    });

    it('should call next once', () => {
      next.should.have.been.calledOnce;
    });
  });

  describe('Use Test Endpoint', () => {
    it('it should take /test/bootstrap-session as the first argument', () => {
      const useArgs = useStub.getCall(1).args[0];
      useArgs.should.eql('/test/bootstrap-session');
    });

    it('the send method on res should be called', () => {
      sendStub.should.have.been.calledOnce.calledWithExactly('Session populate complete');
    });

    it('if no app name key set but a redis session is available set the app name key to an empty object', () => {
      expect(req.session['hof-wizard-testApp']).to.exist;
    });

    it('if session properties are set in the body they are set on hof-wizard-appName', () => {
      req.session['hof-wizard-testApp'].should.eql(
        {
          testProp1: 'test',
          testProp2: 'test'
        }
      );
    });
  });
});

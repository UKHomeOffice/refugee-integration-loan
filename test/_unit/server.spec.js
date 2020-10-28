'use strict';
const config = require('../../config');
const { nodeEnv } = require('../../config');
const proxyquire = require('proxyquire').noCallThru();
// const hof = require('hof');

describe.only('app', () => {
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
  
  // let res;
  // let req;
  // let next;

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

  afterEach(() => {
    sinon.restore();
  });

  describe('hof', () => {
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
    it('is called 3 times in the test environment', () => {
      useStub.should.have.been.calledThrice;
    });

    // TODO check wording

    // it('on the first call the res argument should have properties set on it', () => {
    //   let args = useStub.getCall(0).args[0];

    //   console.log(args);
      
    // });

    it('on the second call is called with /insight and metrics()', () => {
      const useArgs = useStub.getCall(1).args;
      useArgs.should.eql(['/insight', 'metricStubReturn']);
      metricsStub.should.have.been.calledOnce;
    });

    


  });


});

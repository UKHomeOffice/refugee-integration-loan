
const SetContinueLinkBehaviour = require('../../../../../apps/common/behaviours/set-continue-link');
const config = require('../../../../../config');

describe('Set continue link behaviour', () => {
  class Base {}

  describe('#locals', () => {
    let behaviour;
    let Behaviour;
    let superLocalsStub;
    let req;
    let res;

    beforeEach(() => {
      req = request();

      res = response();
      superLocalsStub = sinon.stub();

      Base.prototype.locals = superLocalsStub;

      Behaviour = SetContinueLinkBehaviour;
      Behaviour = Behaviour(Base);
      behaviour = new Behaviour();
    });

    it('should return a mixin', () => {
      expect(behaviour).to.be.an.instanceOf(Base);
    });

    it('should call super.locals', () => {
      behaviour.locals(req, res);
      superLocalsStub.should.be.calledOnce;
    });

    it('should set the continueLink to the landing page when no referer is present', () => {
      behaviour.locals(req, res);
      res.locals.continueLink.should.eql(config.govukLandingPageUrl.href);
    });

    it('should set the continueLink to the referer if it is from the accept app', () => {
      req.headers.referer = 'http://example.com/accept';
      behaviour.locals(req, res);

      res.locals.continueLink.should.eql('/accept');
    });

    it('should set the continueLink to the referer if it is from the apply app', () => {
      req.headers.referer = 'http://example.com/apply';
      behaviour.locals(req, res);

      res.locals.continueLink.should.eql('/apply');
    });

    it('should set the continueLink step to that in the referer', () => {
      req.headers.referer = 'http://example.com/accept/step';
      behaviour.locals(req, res);

      res.locals.continueLink.should.eql('/accept/step');
    });

    it('should drop the step if it contains invalid characters', () => {
      req.headers.referer = 'http://example.com/accept/b@d_step';
      behaviour.locals(req, res);

      res.locals.continueLink.should.eql('/accept');

      req.headers.referer = 'http://example.com/accept/bad:step';
      behaviour.locals(req, res);

      res.locals.continueLink.should.eql('/accept');
    });

    it('should not set the continueLink to the referer if it is not accept or apply', () => {
      req.headers.referer = 'http://example.com/accept';
      behaviour.locals(req, res);

      req.headers.referer = 'http://example.com/bad';
      behaviour.locals(req, res);

      res.locals.continueLink.should.eql('/accept');
    });

    it('should set the continueLink to the landing page when the referer is external', () => {
      req.headers.referer = 'http://external.com/test';
      behaviour.locals(req, res);

      res.locals.continueLink.should.eql(config.govukLandingPageUrl.href);
    });
  });
});

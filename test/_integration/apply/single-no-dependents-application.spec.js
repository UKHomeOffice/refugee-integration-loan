'use strict';

describe('the journey of a single person with no dependents apply application', () => {

  let testApp;
  let passStep;
  let initSession;

  const SUBAPP = 'apply';

  beforeEach(function setup() {
    this.timeout(4000);
    testApp = utils.getSupertestApp();

    passStep = (uri, data) => utils.passStep(testApp, `/${SUBAPP}${uri}`, data);
    initSession = (uri, options) => utils.initSession(testApp, SUBAPP, uri, options);
  });


  it('has a happy path when the user starts on the index page', async() => {
    const URI = '/index';
    await initSession(URI);
    const response = await passStep(URI, {});

    expect(response.text).to.contain('Found. Redirecting to /apply/previously-applied');
  });

  it('goes to the partner page when the user has not previously applied', async() => {
    const URI = '/previously-applied';
    await initSession(URI);
    const response = await passStep(URI, {
      previouslyApplied: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/partner');
  });

  it('goes to the previous page when the user has previously applied', async() => {
    const URI = '/previously-applied';
    await initSession(URI);
    const response = await passStep(URI, {});

    expect(response.text).to.contain('Found. Redirecting to /apply/previous');
  });

  it('goes to the BRP page when the user has no partner', async() => {
    const URI = '/partner';
    await initSession(URI);
    const response = await passStep(URI, {
      partner: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/brp');
  });

});

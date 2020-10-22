'use strict';

describe('the journey of a person who has previously applied', () => {

  let testApp;
  let passStep;
  let initSession;

  const SUBAPP = 'apply';

  before(function setup() {
    this.timeout(4000);
    testApp = utils.getSupertestApp();

    passStep = (uri, data) => utils.passStep(testApp, `/${SUBAPP}${uri}`, data);
    initSession = (uri, options) => utils.initSession(testApp, SUBAPP, uri, options);
  });

  it('goes to the previously applied page after the index page', async() => {
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
    const response = await passStep(URI, {
      previouslyApplied: 'yes'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/previous');
  });

  it('goes to the partner page when the user has not previously been granted a RIL', async() => {
    const URI = '/previous';
    await initSession(URI);
    const response = await passStep(URI, {
      previouslyHadIntegrationLoan: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/partner');
  });

  it('goes to the who-received-previous-loan page when the user has been granted a RIL', async() => {
    const URI = '/previous';
    await initSession(URI);
    const response = await passStep(URI, {
      previouslyHadIntegrationLoan: 'yes'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/who-received-previous-loan');
  });

  it('goes to the partner page when the user has requested a loan for someone else', async() => {
    const URI = '/who-received-previous-loan';
    await initSession(URI);
    const response = await passStep(URI, {
      whoReceivedPreviousLoan: 'someoneElse'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/partner');
  });

  it('goes to the ineligible page if a loan has been requested for the user', async() => {
    const URI = '/who-received-previous-loan';
    await initSession(URI);
    const response = await passStep(URI, {
      whoReceivedPreviousLoan: 'me'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/ineligible');
  });

  it('goes to the ineligible page if a loan has been requested for their partner', async() => {
    const URI = '/who-received-previous-loan';
    await initSession(URI);
    const response = await passStep(URI, {
      whoReceivedPreviousLoan: 'partner'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/ineligible');
  });

});

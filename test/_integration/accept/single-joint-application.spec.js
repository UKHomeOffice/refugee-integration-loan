'use strict';

describe('the journey of a single or joint accept application', () => {

  let testApp;
  let passStep;
  let initSession;

  const SUBAPP = 'accept';

  before(function setup() {
    this.timeout(4000);
    testApp = utils.getSupertestApp();

    passStep = (uri, data) => utils.passStep(testApp, `/${SUBAPP}${uri}`, data);
    initSession = (uri, options) => utils.initSession(testApp, SUBAPP, uri, options);
  });

  it('goes to the BRP page when a user submits a loan reference number', async() => {
    const URI = '/reference-number';
    await initSession(URI);
    const response = await passStep(URI, {
      loanReference: 'LR12345'
    });

    expect(response.text).to.contain('Found. Redirecting to /accept/brp');
  });

  it('goes to the Confirm page when a user submits their BRP details', async() => {
    const URI = '/brp';
    await initSession(URI);
    const response = await passStep(URI, {
      brpNumber: 'ZU1234567',
      dateOfBirth: '1954-11-22'
    });

    expect(response.text).to.contain('Found. Redirecting to /accept/confirm');
  });

});

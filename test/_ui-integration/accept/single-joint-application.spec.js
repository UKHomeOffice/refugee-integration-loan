
describe('the journey of a single or joint accept application', () => {
  let testApp;
  let passStep;
  let initSession;

  const SUBAPP = 'accept';

  before(() => {
    testApp = getSupertestApp(SUBAPP);
    passStep = testApp.passStep;
    initSession = testApp.initSession;
  });

  it('goes to the BRP page when a user submits a loan reference number', async () => {
    const URI = '/reference-number';
    await initSession(URI);
    const response = await passStep(URI, {
      loanReference: '12345'
    });

    expect(response.text).to.contain('Found. Redirecting to /accept/brp');
  });

  it('goes to the Contact page when a user submits their BRP details', async () => {
    const URI = '/brp';
    await initSession(URI);
    const response = await passStep(URI, {
      brpNumber: 'ZU1234567',
      dateOfBirth: '1954-11-22'
    });

    expect(response.text).to.contain('Found. Redirecting to /accept/contact');
  });

  it('goes to the Confirm page when a user submits their Contact details', async () => {
    const URI = '/contact';
    await initSession(URI);
    const response = await passStep(URI, {
      contactTypes: [
        'email',
        'phone'
      ],
      email: 'test@test.com',
      phone: '07922222222'
    });

    expect(response.text).to.contain('Found. Redirecting to /accept/confirm');
  });

  it('goes to the Confirm page when a user submits only their phone number Contact details', async () => {
    const URI = '/contact';
    await initSession(URI);
    const response = await passStep(URI, {
      contactTypes: [
        'phone'
      ],
      phone: '07922222222'
    });

    expect(response.text).to.contain('Found. Redirecting to /accept/confirm');
  });

  it('goes to the Confirm page when a user submits only their email Contact details', async () => {
    const URI = '/contact';
    await initSession(URI);
    const response = await passStep(URI, {
      contactTypes: [
        'email'
      ],
      email: 'test@test.com'
    });

    expect(response.text).to.contain('Found. Redirecting to /accept/confirm');
  });
});

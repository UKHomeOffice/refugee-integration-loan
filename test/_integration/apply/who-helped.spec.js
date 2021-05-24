
describe('the journey of a single person with no dependents apply application', () => {
  let testApp;
  let passStep;
  let initSession;

  const SUBAPP = 'apply';

  before(() => {
    testApp = getSupertestApp(SUBAPP);
    passStep = testApp.passStep;
    initSession = testApp.initSession;
  });

  it('goes to the Confirm page if a user has not had help', async () => {
    const URI = '/help';
    await initSession(URI);
    const response = await passStep(URI, {
      hadHelp: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/confirm');
  });

  it('goes to the Help Reasons page if a user has had help', async () => {
    const URI = '/help';
    await initSession(URI);
    const response = await passStep(URI, {
      hadHelp: 'yes'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/help-reasons');
  });

  it('goes to the Who Helped page when a user submits help reasons', async () => {
    const URI = '/help-reasons';
    await initSession(URI);
    const response = await passStep(URI, {
      helpReasons: [
        'no_internet',
        'english_not_first_language',
        'not_confident',
        'faster',
        'health_condition'
      ]
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/who-helped');
  });

  it('goes to the Confirm page when a user submits details of who helped', async () => {
    const URI = '/who-helped';
    await initSession(URI);
    const response = await passStep(URI, {
      helpFullName: 'Uncle Bob',
      helpRelationship: 'Uncle',
      helpContactTypes: [
        'email',
        'phone'
      ],
      helpEmail: 'bob@bob.com',
      helpPhone: '07988888888'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/confirm');
  });

  it('goes to the Confirm page when a user submits details of who helped without email', async () => {
    const URI = '/who-helped';
    await initSession(URI);
    const response = await passStep(URI, {
      helpFullName: 'Uncle Bob',
      helpRelationship: 'Uncle',
      helpContactTypes: [
        'phone'
      ],
      helpPhone: '07988888888'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/confirm');
  });
});

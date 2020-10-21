'use strict';

describe('the journey of a single apply application', () => {

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

  it('goes to the BRP page when the user does not have a partner they live with', async() => {
    const URI = '/partner';
    await initSession(URI);
    const response = await passStep(URI, {
      partner: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/brp');
  });

  it('goes to the NI Number page when the user has submitted their brp details', async() => {
    const URI = '/brp';
    await initSession(URI);
    const response = await passStep(URI, {
      brpNumber: 'ZU1234567',
      fullName: 'Joe Bloggs',
      dateOfBirth: '1954-11-22'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/ni-number');
  });

  it('goes to the Has Other Names page when the user has submitted their NI number', async() => {
    const URI = '/ni-number';
    await initSession(URI);
    const response = await passStep(URI, {
      niNumber: 'JY111111D'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/has-other-names');
  });

  it('goes to the Home Office Reference page when the user has no other names', async() => {
    const URI = '/has-other-names';
    await initSession(URI);
    const response = await passStep(URI, {
      hasOtherNames: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/home-office-reference');
  });

  it('goes to the Other Names page when the user has other names', async() => {
    const URI = '/has-other-names';
    await initSession(URI);
    const response = await passStep(URI, {
      hasOtherNames: 'yes'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/other-names');
  });

  it('goes to the Convictions page when a single user has submitted their HO Reference Number', async() => {
    const URI = '/home-office-reference';
    await initSession(URI, { joint: 'no' });
    const response = await passStep(URI, {
      homeOfficeReference: '123456'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/convictions');
  });

  it('goes to the Dependents page if a user has no conviction', async() => {
    const URI = '/convictions';
    await initSession(URI);
    const response = await passStep(URI, {
      convicted: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/dependents');
  });

  it('goes to the Dependents page if a user has a conviction with details', async() => {
    const URI = '/convictions';
    await initSession(URI);
    const response = await passStep(URI, {
      convicted: 'yes',
      detailsOfCrime: 'Burglary'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/dependents');
  });

  it('goes to the Address page if a user has no dependents', async() => {
    const URI = '/dependents';
    await initSession(URI);
    const response = await passStep(URI, {
      dependents: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/address');
  });

  it('goes to the Dependents Details page if a user has dependents', async() => {
    const URI = '/dependents';
    await initSession(URI);
    const response = await passStep(URI, {
      dependents: 'yes'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/dependent-details');
  });

  it('goes to the Income page when a single user submits their address', async() => {
    const URI = '/address';
    await initSession(URI, { joint: 'no' });
    const response = await passStep(URI, {
      building: '19',
      street: 'Trombone Street',
      townOrCity: 'London',
      postcode: 'W118JB'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/income');
  });

  it('goes to the Outgoings page when a user submits their income', async() => {
    const URI = '/income';
    await initSession(URI);
    const response = await passStep(URI, {
      incomeTypes: [
        'salary',
        'universal_credit',
        'child_benefit',
        'housing_benefit',
        'other'
      ],
      salaryAmount: '2000',
      universalCreditAmount: '100',
      childBenefitAmount: '200',
      housingBenefitAmount: '300',
      otherIncomeAmount: '400'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/outgoings');
  });

  it('goes to the Savings page when a user submits their outgoings', async() => {
    const URI = '/outgoings';
    await initSession(URI);
    const response = await passStep(URI, {
      outgoingTypes: [
        'rent',
        'household_bills',
        'food_toiletries_cleaning_supplies',
        'mobile_phone',
        'travel',
        'clothing_and_footwear',
        'universal_credit_deductions',
        'other'
      ],
      rentAmount: '1000',
      householdBillsAmount: '100',
      foodToiletriesAndCleaningSuppliesAmount: '50',
      mobilePhoneAmount: '25',
      travelAmount: '10',
      clothingAndFootwearAmount: '20',
      universalCreditDeductionsAmount: '30',
      otherOutgoingAmount: '40'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/savings');
  });

  it('goes to the Amount page when a user submits their savings', async() => {
    const URI = '/savings';
    await initSession(URI);
    const response = await passStep(URI, {
      savings: 'yes',
      savingsAmount: '2345'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/amount');
  });

  it('goes to the Purpose page when a user submits their amount', async() => {
    const URI = '/amount';
    await initSession(URI);
    const response = await passStep(URI, {
      amount: '500'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/purpose');
  });

  it('goes to the Bank Details page when a user submits their purpose types', async() => {
    const URI = '/purpose';
    await initSession(URI);
    const response = await passStep(URI, {
      purposeTypes: [
        'housing',
        'essential_items',
        'basic_living_costs',
        'training_or_retraining',
        'work_clothing_and_equipment'
      ]
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/bank-details');
  });

  it('goes to the Contact page when a user submits their bank details', async() => {
    const URI = '/bank-details';
    await initSession(URI);
    const response = await passStep(URI, {
      accountName: 'Mr Joe',
      sortCode: '111111',
      accountNumber: '222222',
      rollNumber: '12'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/contact');
  });

  it('goes to the Help page when a user submits their contact details', async() => {
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

    expect(response.text).to.contain('Found. Redirecting to /apply/help');
  });

  it('goes to the Outcome page when a user submits their contact details without email', async() => {
    const URI = '/contact';
    await initSession(URI);
    const response = await passStep(URI, {
      contactTypes: [
        'phone'
      ],
      phone: '07922222222'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/outcome');
  });

  it('goes to the Help page when a user submits their moving details', async() => {
    const URI = '/outcome';
    await initSession(URI);
    const response = await passStep(URI, {
      likelyToMove: 'yes',
      outcomeBuilding: 'The Prairie',
      outcomeStreet: '11 Symbol Street',
      outcomeTownOrCity: 'Benson',
      outcomePostcode: 'OX109SB'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/help');
  });

  it('goes to the Help page when a user does not move', async() => {
    const URI = '/outcome';
    await initSession(URI);
    const response = await passStep(URI, {
      likelyToMove: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/help');
  });

  it('goes to the Confirm page if a user has not had help', async() => {
    const URI = '/help';
    await initSession(URI);
    const response = await passStep(URI, {
      hadHelp: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/confirm');
  });

});

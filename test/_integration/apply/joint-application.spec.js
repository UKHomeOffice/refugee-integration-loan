'use strict';

describe('the journey of a joint apply application', () => {

  let testApp;
  let passStep;
  let initSession;

  const SUBAPP = 'apply';

  before(function setup() {
    testApp = getSupertestApp(SUBAPP);
    passStep = testApp.passStep;
    initSession = testApp.initSession;
  });

  it('goes to the partner page when the user has not previously applied', async() => {
    const URI = '/previously-applied';
    await initSession(URI);
    const response = await passStep(URI, {
      previouslyApplied: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/partner');
  });

  it('goes to the Joint page when the user has a partner they live with', async() => {
    const URI = '/partner';
    await initSession(URI);
    const response = await passStep(URI, {
      partner: 'yes'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/joint');
  });

  it('goes to the BRP page when the user does not want a joint application', async() => {
    const URI = '/joint';
    await initSession(URI);
    const response = await passStep(URI, {
      joint: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/brp');
  });

  it('goes to the BRP page when the user does want a joint application', async() => {
    const URI = '/joint';
    await initSession(URI);
    const response = await passStep(URI, {
      joint: 'yes'
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

  it('goes to the Partner BRP page when the primary user has submitted their HO Reference Number', async() => {
    const URI = '/home-office-reference';
    await initSession(URI);
    const response = await passStep(URI, {
      homeOfficeReference: '123456'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/partner-brp');
  });

  it('goes to the Partner NI Number page when the partner has submitted their BRP details', async() => {
    const URI = '/partner-brp';
    await initSession(URI);
    const response = await passStep(URI, {
      partnerBrpNumber: 'ZU1434569',
      partnerFullName: 'Janice Bloggs',
      partnerDateOfBirth: '1962-10-28'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/partner-ni-number');
  });

  it('goes to the Partner Has Other Names page when the partner has submitted their NI Number', async() => {
    const URI = '/partner-ni-number';
    await initSession(URI);
    const response = await passStep(URI, {
      partnerNiNumber: 'YJ222222D'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/partner-has-other-names');
  });

  it('goes to the Convictions Joint page when the partner has no other names', async() => {
    const URI = '/partner-has-other-names';
    await initSession(URI);
    const response = await passStep(URI, {
      partnerHasOtherNames: 'no'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/convictions-joint');
  });

  it('goes to the Partner Other Names page when the partner has other names', async() => {
    const URI = '/partner-has-other-names';
    await initSession(URI);
    const response = await passStep(URI, {
      partnerHasOtherNames: 'yes'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/partner-other-names');
  });

  it('goes to the Dependents page when join convictions are submitted', async() => {
    const URI = '/convictions-joint';
    await initSession(URI);
    const response = await passStep(URI, {
      convictedJoint: 'yes',
      detailsOfCrimeJoint: 'Joint Burglary'
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

  it('goes to the Combined Income page when they submit their address', async() => {
    const URI = '/address';
    await initSession(URI);
    const response = await passStep(URI, {
      building: '19',
      street: 'Trombone Street',
      townOrCity: 'London',
      postcode: 'W118JB'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/combined-income');
  });

  it('goes to the Combined Outgoings page when they submit their income', async() => {
    const URI = '/combined-income';
    await initSession(URI);
    const response = await passStep(URI, {
      combinedIncomeTypes: [
        'salary',
        'universal_credit',
        'child_benefit',
        'housing_benefit',
        'other'
      ],
      combinedSalaryAmount: '2000',
      combinedUniversalCreditAmount: '100',
      combinedChildBenefitAmount: '200',
      combinedHousingBenefitAmount: '300',
      combinedOtherIncomeAmount: '400'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/combined-outgoings');
  });

  it('goes to the Combined Savings page when they submit their outgoings', async() => {
    const URI = '/combined-outgoings';
    await initSession(URI);
    const response = await passStep(URI, {
      combinedOutgoingTypes: [
        'rent',
        'household_bills',
        'food_toiletries_cleaning_supplies',
        'mobile_phone',
        'travel',
        'clothing_and_footwear',
        'universal_credit_deductions',
        'other'
      ],
      combinedRentAmount: '1000',
      combinedHouseholdBillsAmount: '100',
      combinedFoodToiletriesAndCleaningSuppliesAmount: '50',
      combinedMobilePhoneAmount: '25',
      combinedTravelAmount: '10',
      combinedClothingAndFootwearAmount: '20',
      combinedUniversalCreditDeductionsAmount: '30',
      combinedOtherOutgoingAmount: '40'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/combined-savings');
  });

  it('goes to the Combined Amount page when they submit their savings', async() => {
    const URI = '/combined-savings';
    await initSession(URI);
    const response = await passStep(URI, {
      combinedSavings: 'yes',
      combinedSavingsAmount: '2345'
    });

    expect(response.text).to.contain('Found. Redirecting to /apply/combined-amount');
  });

  it('goes to the Purpose page when they submit their amount', async() => {
    const URI = '/combined-amount';
    await initSession(URI);
    const response = await passStep(URI, {
      jointAmount: '780'
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

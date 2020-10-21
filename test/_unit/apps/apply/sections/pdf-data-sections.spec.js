'use strict';

const _ = require('lodash');
const { expect } = require('chai');
const pdfDataSections = require('../../../../../apps/apply/sections/pdf-data-sections');
const pages = require('../../../../../apps/apply/translations/src/en/pages.json');

describe('pdfDataSections', () => {
  it('pdfDataSections and section keys within pages are identical', () => {
    const pdfDataSectionsKeys = Object.keys(pdfDataSections).sort();
    const pagesSectionsKeys = Object.keys(pages.confirm.sections).sort();

    expect(_.isEqual(pdfDataSectionsKeys, pagesSectionsKeys)).to.eql(true);
  });

  describe('pdfDataSections has the correct fields', () => {
    const containsAll = (currentFields, expectedFields) => {
      return expectedFields.every(i => currentFields.includes(i));
    };


    it('pdf-applicant-details', () => {
      expect(containsAll(
        pdfDataSections['pdf-applicant-details'],
        ['brpNumber', 'niNumber', 'fullName', 'homeOfficeReference']
        )).to.eql(true);

      expect(pdfDataSections['pdf-applicant-details'][3].field).to.eql('dateOfBirth');
    });

    it('other-names', () => {
      expect(containsAll(
        pdfDataSections['other-names'],
        ['otherNames']
      )).to.eql(true);
    });

    it('pdf-partner-details', () => {
      expect(containsAll(
        pdfDataSections['pdf-partner-details'],
        ['partnerBrpNumber', 'partnerNiNumber', 'partnerFullName']
      )).to.eql(true);

      expect(pdfDataSections['pdf-partner-details'][3].field).to.eql('partnerDateOfBirth');
    });

    it('partner-other-names', () => {
      expect(containsAll(
        pdfDataSections['partner-other-names'],
        ['partnerOtherNames']
      )).to.eql(true);
    });

    it('pdf-bank-account-details', () => {
      expect(containsAll(
        pdfDataSections['pdf-bank-account-details'],
        ['accountName', 'sortCode', 'accountNumber', 'rollNumber']
      )).to.eql(true);
    });

    it('pdf-conviction-details', () => {
      expect(containsAll(
        pdfDataSections['pdf-conviction-details'],
        ['convicted', 'detailsOfCrime', 'convictedJoint', 'detailsOfCrimeJoint']
      )).to.eql(true);
    });

    it('pdf-conviction-details', () => {
      expect(containsAll(
        pdfDataSections['pdf-conviction-details'],
        ['convicted', 'detailsOfCrime', 'convictedJoint', 'detailsOfCrimeJoint']
      )).to.eql(true);
    });

    it('pdf-income', () => {
      expect(containsAll(
        pdfDataSections['pdf-income'],
        ['incomeTypes', 'combinedIncomeTypes']
      )).to.eql(true);

      expect(containsAll(
        pdfDataSections['pdf-income'][2].derivation.fromFields,
        [
          'salaryAmount',
          'universalCreditAmount',
          'childBenefitAmount',
          'housingBenefitAmount',
          'otherIncomeAmount',
          'combinedSalaryAmount',
          'combinedUniversalCreditAmount',
          'combinedChildBenefitAmount',
          'combinedHousingBenefitAmount',
          'combinedOtherIncomeAmount'
        ])
        ).to.eql(true);
    });

    it('pdf-outgoings', () => {
      expect(containsAll(
        pdfDataSections['pdf-outgoings'],
        ['outgoingTypes']
      )).to.eql(true);

      expect(containsAll(
        pdfDataSections['pdf-outgoings'][1].derivation.fromFields,
        [
          'rentAmount',
          'householdBillsAmount',
          'foodToiletriesAndCleaningSuppliesAmount',
          'mobilePhoneAmount',
          'travelAmount',
          'clothingAndFootwearAmount',
          'universalCreditDeductionsAmount',
          'otherOutgoingAmount',
          'combinedRentAmount',
          'combinedHouseholdBillsAmount',
          'combinedFoodToiletriesAndCleaningSuppliesAmount',
          'combinedMobilePhoneAmount',
          'combinedTravelAmount',
          'combinedClothingAndFootwearAmount',
          'combinedUniversalCreditDeductionsAmount',
          'combinedOtherOutgoingAmount'
        ])
      ).to.eql(true);
    });

    it('pdf-savings', () => {
      expect(containsAll(
        pdfDataSections['pdf-savings'],
        [
          'savings',
          'savingsAmount',
          'combinedSavings',
          'combinedSavingsAmount'
        ]
      )).to.eql(true);
    });

    it('pdf-loan-details', () => {
      expect(containsAll(
        pdfDataSections['pdf-loan-details'],
        [
          'amount',
          'jointAmount',
          'purposeTypes',
        ]
      )).to.eql(true);
    });

    it('pdf-address', () => {
      expect(containsAll(
        pdfDataSections['pdf-address'],
        [
          'building',
          'street',
          'townOrCity',
          'postcode'
        ]
      )).to.eql(true);
    });

    it('pdf-contact-details', () => {
      expect(containsAll(
        pdfDataSections['pdf-contact-details'],
        [
          'email',
          'phone'
        ]
      )).to.eql(true);
    });

    it('dependent-details', () => {
      expect(containsAll(
        pdfDataSections['dependent-details'],
        [
          'dependentFullName',
          'dependentDateOfBirth',
          'dependentRelationship'
        ]
      )).to.eql(true);
    });

    it('pdf-outcome', () => {
      expect(containsAll(
        pdfDataSections['pdf-outcome'],
        [
          'likelyToMove',
          'outcomeBuilding',
          'outcomeStreet',
          'outcomeTownOrCity',
          'outcomePostcode'
        ]
      )).to.eql(true);
    });

    it('pdf-help', () => {
      expect(containsAll(
        pdfDataSections['pdf-help'],
        [
          'hadHelp',
          'helpReasons',
          'helpFullName',
          'helpRelationship',
          'helpEmail',
          'helpPhone'
        ]
      )).to.eql(true);
    });

    it('pdf-other', () => {
      expect(containsAll(
        pdfDataSections['pdf-other'],
        [
          'previouslyApplied',
          'previouslyHadIntegrationLoan',
          'whoReceivedPreviousLoan',
          'partner',
          'joint'
        ]
      )).to.eql(true);
    });
  });
});

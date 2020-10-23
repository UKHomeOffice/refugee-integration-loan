/* eslint-disable no-unused-expressions */
'use strict';
const pdfDataSections = require('../../../../../apps/apply/sections/pdf-data-sections');
const pages = require('../../../../../apps/apply/translations/src/en/pages.json');
const fields = require('../../../../../apps/apply/fields/index');

describe.only('pdfDataSections', () => {
  const containsAll = (arr1, arr2) => {
    return arr2.every(i => arr1.includes(i));
  };

  describe('pdfDataSections and pages', () => {
    it('pdfDataSections and section keys within pages are identical', () => {
      const pdfDataSectionsKeys = Object.keys(pdfDataSections).sort();
      const pagesSectionsKeys = Object.keys(pages.confirm.sections).sort();

      expect(_.isEqual(pdfDataSectionsKeys, pagesSectionsKeys)).to.be.true;
    });
  });

  describe('pdfDataSections has the correct fields', () => {
    const areOrderedEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);

    const mapFields = arr => _.map(arr, item => item.field || item);

    it('pdf-applicant-details', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-applicant-details']);
      const expectedFields = [
        'brpNumber',
        'niNumber',
        'fullName',
        'dateOfBirth',
        'homeOfficeReference'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('other-names', () => {
      const sectionFields = mapFields(pdfDataSections['other-names']);
      const expectedFields = [
        'otherNames'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-partner-details', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-partner-details']);
      const expectedFields = [
        'partnerBrpNumber',
        'partnerNiNumber',
        'partnerFullName',
        'partnerDateOfBirth'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('partner-other-names', () => {
      const sectionFields = mapFields(pdfDataSections['partner-other-names']);
      const expectedFields = [
        'partnerOtherNames'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-bank-account-details', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-bank-account-details']);
      const expectedFields = [
        'accountName',
        'sortCode',
        'accountNumber',
        'rollNumber'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-conviction-details', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-conviction-details']);
      const expectedFields = [
        'convicted',
        'detailsOfCrime',
        'convictedJoint',
        'detailsOfCrimeJoint'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-income', () => {
      const sectionFields = mapFields(
        pdfDataSections['pdf-income'].concat(pdfDataSections['pdf-income'][2].derivation.fromFields)
        );
      const expectedFields = [
        'incomeTypes',
        'combinedIncomeTypes',
        'totalIncome',
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
      ];
      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-outgoings', () => {
      const sectionFields = mapFields(
        pdfDataSections['pdf-outgoings'].concat(pdfDataSections['pdf-outgoings'][1].derivation.fromFields)
      );

      const expectedFields = [
        'outgoingTypes',
        'totalOutgoings',
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
      ];
      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-savings', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-savings']);
      const expectedFields = [
        'savings',
        'savingsAmount',
        'combinedSavings',
        'combinedSavingsAmount'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-loan-details', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-loan-details']);
      const expectedFields = [
        'amount',
        'jointAmount',
        'purposeTypes',
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-address', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-address']);
      const expectedFields = [
        'building',
        'street',
        'townOrCity',
        'postcode'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-contact-details', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-contact-details']);
      const expectedFields = [
        'email',
        'phone'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('dependent-details', () => {
      const sectionFields = mapFields(pdfDataSections['dependent-details']);
      const expectedFields = [
        'dependentFullName',
        'dependentDateOfBirth',
        'dependentRelationship'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-outcome', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-outcome']);
      const expectedFields = [
        'likelyToMove',
        'outcomeBuilding',
        'outcomeStreet',
        'outcomeTownOrCity',
        'outcomePostcode'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-help', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-help']);
      const expectedFields = [
        'hadHelp',
        'helpReasons',
        'helpFullName',
        'helpRelationship',
        'helpEmail',
        'helpPhone'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });

    it('pdf-other', () => {
      const sectionFields = mapFields(pdfDataSections['pdf-other']);
      const expectedFields = [
        'previouslyApplied',
        'previouslyHadIntegrationLoan',
        'whoReceivedPreviousLoan',
        'partner',
        'joint'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });
  });

  describe('fields file contains the pdfDataSections fields', () => {
    it('pdf-applicant-details', () => {
      pdfDataSections['pdf-applicant-details'].every(i => {
        const item = i.field || i;
        return Object.keys(fields).includes(item);
      });
    });

    it('other-names', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['other-names'])
        ).to.be.true;
    });

    it('pdf-partner-details', () => {
      pdfDataSections['pdf-partner-details'].every(i => {
        const item = i.field || i;
        return Object.keys(fields).includes(item);
      });
    });

    it('partner-other-names', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['partner-other-names'])
      ).to.be.true;
    });

    it('pdf-bank-account-details', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-bank-account-details'])
      ).to.be.true;
    });

    it('pdf-conviction-details', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-conviction-details'])
      ).to.be.true;
    });

    it('pdf-income', () => {
      pdfDataSections['pdf-income'].every(i => {
        if (typeof i === 'string') {
          return Object.keys(fields).includes(i);
        }
        return Object.keys(fields).includes(i.derivation.fromFields);
      });
    });

    it('pdf-outgoings', () => {
      pdfDataSections['pdf-outgoings'].every(i => {
        if (typeof i === 'string') {
          return Object.keys(fields).includes(i);
        }
        return Object.keys(fields).includes(i.derivation.fromFields);
      });
    });

    it('pdf-savings', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-savings'])
      ).to.be.true;
    });

    it('pdf-loan-details', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-loan-details'])
      ).to.be.true;
    });

    it('pdf-address', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-address'])
      ).to.be.true;
    });

    it('pdf-contact-details', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-contact-details'])
      ).to.be.true;
    });

    it('dependent-details', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['dependent-details'])
      ).to.be.true;
    });

    it('pdf-outcome', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-outcome'])
      ).to.be.true;
    });

    it('pdf-help', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-help'])
      ).to.be.true;
    });

    it('pdf-other', () => {
      expect(containsAll(
        Object.keys(fields),
        pdfDataSections['pdf-other'])
      ).to.be.true;
    });
  });
});

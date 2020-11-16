'use strict';

const moment = require('moment');
const config = require('../../../config');

const sumValues = values => values.map(it => Number(it)).reduce((a, b) => a + b, 0);

module.exports = {
  'pdf-applicant-details': [
    'brpNumber',
    'niNumber',
    'fullName',
    {
      field: 'dateOfBirth',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    },
    'homeOfficeReference'
  ],
  'has-other-names': [
    {
      step: '/has-other-names',
      field: 'hasOtherNames',
      omitFromPdf: true
    },
  ],
  'other-names': [
    {
      step: '/other-names',
      field: 'otherNames',
      dependsOn: 'hasOtherNames'
    },
  ],
  'pdf-partner-details': [
    'partnerBrpNumber',
    'partnerNiNumber',
    'partnerFullName',
    {
      field: 'partnerDateOfBirth',
      parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
    }
  ],
  'partner-has-other-names': [
    {
      step: '/partner-has-other-names',
      field: 'partnerHasOtherNames',
      omitFromPdf: true
    }
  ],
  'partner-other-names': [
    {
      step: '/partner-other-names',
      field: 'partnerOtherNames',
      dependsOn: 'partnerHasOtherNames'
    },
  ],
  'pdf-bank-account-details': [
    'accountName',
    'sortCode',
    'accountNumber',
    'rollNumber'
  ],
  'pdf-conviction-details': [
    'convicted',
    'detailsOfCrime',
    'convictedJoint',
    'detailsOfCrimeJoint'
  ],
  'pdf-income': [
    'incomeTypes',
    'combinedIncomeTypes',
    {
      field: 'totalIncome',
      derivation: {
        fromFields: [
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
        ],
        combiner: sumValues
      }
    }
  ],
  'pdf-outgoings': [
    'outgoingTypes',
    {
      field: 'totalOutgoings',
      derivation: {
        fromFields: [
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
        ],
        combiner: sumValues
      }
    }
  ],
  'pdf-savings': [
    'savings',
    'savingsAmount',
    'combinedSavings',
    'combinedSavingsAmount'
  ],
  'pdf-loan-details': [
    'amount',
    'jointAmount',
    'purposeTypes',
  ],
  'pdf-address': [
    'building',
    'street',
    'townOrCity',
    'postcode'
  ],
  'pdf-contact-details': [
    'email',
    'phone'
  ],
  'has-dependents': [
    {
      step: '/has-dependents',
      field: 'hasDependents',
      omitFromPdf: true
    },
  ],
  'dependent-details': [
    {
      step: '/dependent-details',
      field: 'dependents',
      addElementSeparators: true,
      dependsOn: 'hasDependents'
    }
  ],
  'pdf-outcome': [
    'likelyToMove',
    'outcomeBuilding',
    'outcomeStreet',
    'outcomeTownOrCity',
    'outcomePostcode'
  ],
  'pdf-help': [
    'hadHelp',
    'helpReasons',
    'helpFullName',
    'helpRelationship',
    'helpEmail',
    'helpPhone'
  ],
  'pdf-other': [
    'previouslyApplied',
    'previouslyHadIntegrationLoan',
    'whoReceivedPreviousLoan',
    'partner',
    'joint'
  ]
};

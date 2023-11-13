
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
  'has-other-names': {
    omitFromPdf: true,
    steps: [
      {
        step: '/has-other-names',
        field: 'hasOtherNames'
      }
    ]
  },
  'other-names': [
    {
      step: '/other-names',
      field: 'otherNames',
      dependsOn: 'hasOtherNames'
    }
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
  'partner-has-other-names': {
    omitFromPdf: true,
    steps: [
      {
        step: '/partner-has-other-names',
        field: 'partnerHasOtherNames',
        omitFromPdf: true
      }
    ]
  },
  'partner-other-names': [
    {
      step: '/partner-other-names',
      field: 'partnerOtherNames',
      dependsOn: 'partnerHasOtherNames'
    }
  ],
  'pdf-bank-account-details': [
    'accountName',
    'bankName',
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
      omitFromSummary: true,
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
    },
    { field: 'salaryAmount', omitFromPdf: true },
    { field: 'universalCreditAmount', omitFromPdf: true },
    { field: 'childBenefitAmount', omitFromPdf: true },
    { field: 'housingBenefitAmount', omitFromPdf: true },
    { field: 'otherIncomeAmount', omitFromPdf: true },
    { field: 'otherIncomeExplain', omitFromPdf: false },
    { field: 'combinedSalaryAmount', omitFromPdf: true },
    { field: 'combinedUniversalCreditAmount', omitFromPdf: true },
    { field: 'combinedChildBenefitAmount', omitFromPdf: true },
    { field: 'combinedHousingBenefitAmount', omitFromPdf: true },
    { field: 'combinedOtherIncomeAmount', omitFromPdf: true },
    { field: 'combinedOtherIncomeExplain', omitFromPdf: false }
  ],
  'pdf-outgoings': [
    'outgoingTypes',
    {
      field: 'totalOutgoings',
      omitFromSummary: true,
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
    },
    { field: 'rentAmount', omitFromPdf: true },
    { field: 'householdBillsAmount', omitFromPdf: true },
    { field: 'foodToiletriesAndCleaningSuppliesAmount', omitFromPdf: true },
    { field: 'mobilePhoneAmount', omitFromPdf: true },
    { field: 'travelAmount', omitFromPdf: true },
    { field: 'clothingAndFootwearAmount', omitFromPdf: true },
    { field: 'universalCreditDeductionsAmount', omitFromPdf: true },
    { field: 'otherOutgoingAmount', omitFromPdf: true },
    { field: 'combinedRentAmount', omitFromPdf: true },
    { field: 'combinedHouseholdBillsAmount', omitFromPdf: true },
    { field: 'combinedFoodToiletriesAndCleaningSuppliesAmount', omitFromPdf: true },
    { field: 'combinedMobilePhoneAmount', omitFromPdf: true },
    { field: 'combinedTravelAmount', omitFromPdf: true },
    { field: 'combinedClothingAndFootwearAmount', omitFromPdf: true },
    { field: 'combinedUniversalCreditDeductionsAmount', omitFromPdf: true },
    { field: 'combinedOtherOutgoingAmount', omitFromPdf: true }
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
    'purposeTypes'
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
  'has-dependants': {
    omitFromPdf: true,
    steps: [
      {
        step: '/has-dependants',
        field: 'hasDependants'
      }
    ]
  },
  'dependent-details': [
    {
      step: '/dependant-details',
      field: 'dependants',
      addElementSeparators: true,
      dependsOn: 'hasDependants'
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

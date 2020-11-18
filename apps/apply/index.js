'use strict';

const Aggregate = require('../common/behaviours/aggregator');
const Summary = require('../common/behaviours/summary');
const UploadPDF = require('./behaviours/upload-pdf');
const config = require('../../config');
const confirmStep = config.routes.confirmStep;


module.exports = {
  name: 'apply',
  params: '/:action?/:id?/:edit?',
  baseUrl: '/apply',
  steps: {
    '/previously-applied': {
      fields: ['previouslyApplied'],
      next: '/previous',
      forks: [{
        target: '/partner',
        condition: {
          field: 'previouslyApplied',
          value: 'no'
        }
      }],
      continueOnEdit: true
    },
    '/previous': {
      fields: ['previouslyHadIntegrationLoan'],
      next: '/who-received-previous-loan',
      forks: [{
        target: '/partner',
        condition: {
          field: 'previouslyHadIntegrationLoan',
          value: 'no'
        }
      }],
      continueOnEdit: true
    },
    '/who-received-previous-loan': {
      fields: ['whoReceivedPreviousLoan'],
      next: '/ineligible',
      forks: [{
        target: '/partner',
        condition: {
          field: 'whoReceivedPreviousLoan',
          value: 'someoneElse'
        }
      }],
      continueOnEdit: true
    },
    '/partner': {
      fields: ['partner'],
      next: '/joint',
      forks: [{
        target: '/brp',
        condition: {
          field: 'partner',
          value: 'no'
        }
      }],
      continueOnEdit: true
    },
    '/joint': {
      fields: ['joint'],
      next: '/brp',
      continueOnEdit: true
    },
    '/brp': {
      fields: ['brpNumber', 'fullName', 'dateOfBirth'],
      next: '/ni-number',
      template: 'brp',
      continueOnEdit: true
    },
    '/ni-number': {
      fields: ['niNumber'],
      next: '/has-other-names',
      continueOnEdit: true
    },
    '/has-other-names': {
      fields: ['hasOtherNames'],
      next: '/home-office-reference',
      forks: [{
        target: '/other-names',
        condition: {
          field: 'hasOtherNames',
          value: 'yes'
        }
      }],
      continueOnEdit: true
    },
    '/add-other-name': {
      backLink: 'has-other-names',
      fields: ['otherName'],
      continueOnEdit: true,
      next: '/other-names',
    },
    '/other-names': {
      backLink: 'has-other-names',
      behaviours: [Aggregate, require('../common/behaviours/log_locals')],
      aggregateTo: 'otherNames',
      aggregateFrom: ['otherName'],
      titleField: 'otherName',
      sourceStep: 'add-other-name',
      addAnotherLinkText: 'name',
      template: 'add-another',
      next: '/home-office-reference',
      continueOnEdit: true
    },
    '/home-office-reference': {
      fields: ['homeOfficeReference'],
      next: '/convictions',
      forks: [{
        target: '/partner-brp',
        condition: {
          field: 'joint',
          value: 'yes'
        }
      }],
      continueOnEdit: true
    },
    '/convictions': {
      fields: ['convicted', 'detailsOfCrime'],
      next: '/has-dependants',
      continueOnEdit: true
    },
    '/partner-brp': {
      fields: ['partnerBrpNumber', 'partnerFullName', 'partnerDateOfBirth'],
      next: '/partner-ni-number',
      template: 'brp',
      continueOnEdit: true
    },
    '/partner-ni-number': {
      fields: ['partnerNiNumber'],
      next: '/partner-has-other-names',
      template: 'ni-number',
      continueOnEdit: true
    },
    '/partner-has-other-names': {
      fields: ['partnerHasOtherNames'],
      next: '/convictions-joint',
      forks: [{
        target: '/partner-other-names',
        condition: {
          field: 'partnerHasOtherNames',
          value: 'yes'
        }
      }],
      continueOnEdit: true
    },
    '/partner-add-other-name': {
      backLink: 'partner-has-other-names',
      fields: ['partnerOtherName'],
      continueOnEdit: true,
      next: '/partner-other-names',
    },
    '/partner-other-names': {
      behaviours: [Aggregate, require('../common/behaviours/log_locals')],
      backLink: 'partner-has-other-names',
      aggregateTo: 'partnerOtherNames',
      aggregateFrom: ['partnerOtherName'],
      sourceStep: 'partner-add-other-name',
      titleField: 'partnerOtherName',
      addAnotherLinkText: 'name',
      template: 'add-another',
      next: '/convictions-joint',
      continueOnEdit: true
    },
    '/convictions-joint': {
      fields: ['convictedJoint', 'detailsOfCrimeJoint'],
      next: '/has-dependants',
      continueOnEdit: true
    },
    '/has-dependants': {
      fields: ['hasDependants'],
      next: '/address',
      forks: [{
        target: '/dependant-details',
        condition: {
          field: 'hasDependants',
          value: 'yes'
        }
      }],
      continueOnEdit: true
    },
    '/add-dependent': {
      backLink: 'has-dependants',
      fields: [
        'dependantFullName',
        'dependantDateOfBirth',
        'dependantRelationship'
      ],
      continueOnEdit: true,
      next: '/dependant-details'
    },
    '/dependant-details': {
      backLink: 'has-dependants',
      behaviours: [Aggregate, require('../common/behaviours/log_locals')],
      aggregateTo: 'dependants',
      aggregateFrom: [
        'dependantFullName',
        {field: 'dependantDateOfBirth', changeField: 'dependantDateOfBirth-day'},
        'dependantRelationship'
      ],
      titleField: 'dependantFullName',
      sourceStep: 'add-dependent',
      addAnotherLinkText: 'dependant',
      template: 'add-another',
      next: '/address',
      continueOnEdit: true
    },
    '/address': {
      fields: ['building', 'street', 'townOrCity', 'postcode'],
      next: '/income',
      forks: [{
        target: '/combined-income',
        condition: {
          field: 'joint',
          value: 'yes'
        }
      }],
      continueOnEdit: true
    },
    '/income': {
      fields: [
        'incomeTypes',
        'salaryAmount',
        'universalCreditAmount',
        'childBenefitAmount',
        'housingBenefitAmount',
        'otherIncomeAmount'
      ],
      next: '/outgoings',
      continueOnEdit: true
    },
    '/outgoings': {
      fields: [
        'outgoingTypes',
        'rentAmount',
        'householdBillsAmount',
        'foodToiletriesAndCleaningSuppliesAmount',
        'mobilePhoneAmount',
        'travelAmount',
        'clothingAndFootwearAmount',
        'universalCreditDeductionsAmount',
        'otherOutgoingAmount'
      ],
      next: '/savings',
      continueOnEdit: true
    },
    '/savings': {
      fields: ['savings', 'savingsAmount'],
      next: '/amount',
      continueOnEdit: true
    },
    '/amount': {
      fields: ['amount'],
      next: '/purpose',
      continueOnEdit: true
    },
    '/combined-income': {
      fields: [
        'combinedIncomeTypes',
        'combinedSalaryAmount',
        'combinedUniversalCreditAmount',
        'combinedChildBenefitAmount',
        'combinedHousingBenefitAmount',
        'combinedOtherIncomeAmount'
      ],
      next: '/combined-outgoings',
      continueOnEdit: true
    },
    '/combined-outgoings': {
      fields: [
        'combinedOutgoingTypes',
        'combinedRentAmount',
        'combinedHouseholdBillsAmount',
        'combinedFoodToiletriesAndCleaningSuppliesAmount',
        'combinedMobilePhoneAmount',
        'combinedTravelAmount',
        'combinedClothingAndFootwearAmount',
        'combinedUniversalCreditDeductionsAmount',
        'combinedOtherOutgoingAmount'
      ],
      next: '/combined-savings',
      continueOnEdit: true
    },
    '/combined-savings': {
      fields: ['combinedSavings', 'combinedSavingsAmount'],
      next: '/combined-amount',
      continueOnEdit: true
    },
    '/combined-amount': {
      fields: ['jointAmount'],
      next: '/purpose',
      continueOnEdit: true
    },
    '/purpose': {
      fields: ['purposeTypes'],
      next: '/bank-details',
      continueOnEdit: true
    },
    '/bank-details': {
      fields: ['accountName', 'sortCode', 'accountNumber', 'rollNumber'],
      next: '/contact',
      continueOnEdit: true
    },
    '/contact': {
      fields: ['contactTypes', 'email', 'phone'],
      next: '/help',
      forks: [{
        target: '/outcome',
        condition: req =>
          req.form.values.contactTypes && !(req.form.values.contactTypes.includes('email'))
      }],
      continueOnEdit: true
    },
    '/outcome': {
      fields: ['likelyToMove', 'outcomeBuilding', 'outcomeStreet', 'outcomeTownOrCity', 'outcomePostcode'],
      template: 'outcome',
      next: '/help',
      continueOnEdit: true
    },
    '/help': {
      fields: ['hadHelp'],
      next: '/confirm',
      forks: [{
        target: '/help-reasons',
        condition: {
          field: 'hadHelp',
          value: 'yes'
        }
      }],
      continueOnEdit: true
    },
    '/help-reasons': {
      fields: ['helpReasons'],
      next: '/who-helped',
      continueOnEdit: true
    },
    '/who-helped': {
      fields: ['helpFullName', 'helpRelationship', 'helpContactTypes', 'helpEmail', 'helpPhone'],
      next: '/confirm',
      continueOnEdit: true
    },
    [confirmStep]: {
      behaviours: [Summary, UploadPDF, require('../common/behaviours/log_locals')],
      sections: require('./sections/summary-data-sections'),
      pdfSections: require('./sections/summary-data-sections'),
      uploadPdfShared: false,
      submitted: false,
      next: '/complete'
    },
    '/complete': {
      template: 'confirmation',
      clearSession: true
    },
    '/ineligible': {
      template: 'ineligible'
    }
  }
};

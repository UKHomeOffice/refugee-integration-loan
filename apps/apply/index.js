
const Aggregate = require('../common/behaviours/aggregator');
const setDateErrorLink = require('../common/behaviours/set-date-error-link');
const setRadioButtonErrorLink = require('./behaviours/set-radio-button-error-link');
const Summary = require('hof').components.summary;
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
      behaviours: [setRadioButtonErrorLink],
      next: '/previous',
      forks: [{
        target: '/partner',
        condition: {
          field: 'previouslyApplied',
          value: 'no'
        }
      }],
      returnToSummary: false,
      continueOnEdit: true
    },
    '/previous': {
      fields: ['previouslyHadIntegrationLoan'],
      behaviours: [setRadioButtonErrorLink],
      next: '/who-received-previous-loan',
      forks: [{
        target: '/partner',
        condition: {
          field: 'previouslyHadIntegrationLoan',
          value: 'no'
        }
      }],
      returnToSummary: false,
      continueOnEdit: true
    },
    '/who-received-previous-loan': {
      fields: ['whoReceivedPreviousLoan'],
      behaviours: [setRadioButtonErrorLink],
      next: '/ineligible',
      forks: [{
        target: '/partner',
        condition: {
          field: 'whoReceivedPreviousLoan',
          value: 'someoneElse'
        }
      }],
      returnToSummary: false,
      continueOnEdit: true
    },
    '/partner': {
      fields: ['partner'],
      behaviours: [setRadioButtonErrorLink],
      next: '/joint',
      forks: [{
        target: '/brp',
        condition: {
          field: 'partner',
          value: 'no'
        }
      }],
      returnToSummary: true,
      continueOnEdit: true
    },
    '/joint': {
      returnToSummary: true,
      fields: ['joint'],
      behaviours: [setRadioButtonErrorLink],
      next: '/brp',
      continueOnEdit: true
    },
    '/brp': {
      fields: ['brpNumber', 'fullName', 'dateOfBirth'],
      behaviours: [setDateErrorLink],
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
      behaviours: [setRadioButtonErrorLink],
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
      next: '/other-names'
    },
    '/other-names': {
      backLink: 'has-other-names',
      behaviours: [Aggregate],
      aggregateTo: 'otherNames',
      aggregateFrom: ['otherName'],
      titleField: 'otherName',
      addStep: 'add-other-name',
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
      behaviours: [setRadioButtonErrorLink],
      next: '/has-dependants',
      continueOnEdit: true
    },
    '/partner-brp': {
      fields: ['partnerBrpNumber', 'partnerFullName', 'partnerDateOfBirth'],
      behaviours: [setDateErrorLink],
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
      behaviours: [setRadioButtonErrorLink],
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
      next: '/partner-other-names'
    },
    '/partner-other-names': {
      behaviours: [Aggregate],
      backLink: 'partner-has-other-names',
      aggregateTo: 'partnerOtherNames',
      aggregateFrom: ['partnerOtherName'],
      addStep: 'partner-add-other-name',
      titleField: 'partnerOtherName',
      addAnotherLinkText: 'name',
      template: 'add-another',
      next: '/convictions-joint',
      continueOnEdit: true
    },
    '/convictions-joint': {
      fields: ['convictedJoint', 'detailsOfCrimeJoint'],
      behaviours: [setRadioButtonErrorLink],
      next: '/has-dependants',
      continueOnEdit: true
    },
    '/has-dependants': {
      fields: ['hasDependants'],
      behaviours: [setRadioButtonErrorLink],
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
    '/add-dependant': {
      backLink: 'has-dependants',
      fields: [
        'dependantFullName',
        'dependantDateOfBirth',
        'dependantRelationship'
      ],
      behaviours: [setDateErrorLink],
      continueOnEdit: true,
      next: '/dependant-details'
    },
    '/dependant-details': {
      backLink: 'has-dependants',
      behaviours: [Aggregate],
      aggregateTo: 'dependants',
      aggregateFrom: [
        'dependantFullName',
        {field: 'dependantDateOfBirth', changeField: 'dependantDateOfBirth-day'},
        'dependantRelationship'
      ],
      titleField: 'dependantFullName',
      addStep: 'add-dependant',
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
      behaviours: [setRadioButtonErrorLink],
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
      behaviours: [setRadioButtonErrorLink],
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
      behaviours: [setRadioButtonErrorLink],
      template: 'outcome',
      next: '/help',
      continueOnEdit: true
    },
    '/help': {
      fields: ['hadHelp'],
      behaviours: [setRadioButtonErrorLink],
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
      behaviours: [Summary, UploadPDF],
      sections: require('./sections/summary-data-sections'),
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

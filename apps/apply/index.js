
const Aggregate = require('../common/behaviours/aggregator');
const setDateErrorLink = require('../common/behaviours/set-date-error-link');
const setRadioButtonErrorLink = require('./behaviours/set-radio-button-error-link');
const Summary = require('hof').components.summary;
const UploadPDF = require('./behaviours/upload-pdf');
const config = require('../../config');
const confirmStep = config.routes.confirmStep;
const AddSpacePostcode = require('./behaviours/add-space-postcode');
const RemovePrefix = require('./behaviours/remove-prefix');

module.exports = {
  name: 'apply',
  params: '/:action?/:id?/:edit?',
  baseUrl: '/apply',
  steps: {
    '/previously-applied': {
      behaviours: [setRadioButtonErrorLink],
      fields: ['previouslyApplied'],
      next: '/previous',
      forks: [{
        target: '/partner',
        condition: {
          field: 'previouslyApplied',
          value: 'no'
        }
      }]
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
      }]
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
      }]
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
      }]
    },
    '/joint': {
      fields: ['joint'],
      behaviours: [setRadioButtonErrorLink],
      next: '/brp'
    },
    '/brp': {
      fields: ['brpNumber', 'fullName', 'dateOfBirth'],
      behaviours: [setDateErrorLink],
      next: '/ni-number',
      template: 'brp'
    },
    '/ni-number': {
      fields: ['niNumber'],
      next: '/has-other-names'
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
      }]
    },
    '/add-other-name': {
      backLink: 'has-other-names',
      fields: ['otherName'],
      next: '/other-names',
      continueOnEdit: true
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
      }]
    },
    '/convictions': {
      fields: ['convicted', 'detailsOfCrime'],
      behaviours: [setRadioButtonErrorLink],
      next: '/has-dependants'
    },
    '/partner-brp': {
      fields: ['partnerBrpNumber', 'partnerFullName', 'partnerDateOfBirth'],
      behaviours: [setDateErrorLink],
      next: '/partner-ni-number',
      template: 'partner-brp'
    },
    '/partner-ni-number': {
      fields: ['partnerNiNumber'],
      next: '/partner-has-other-names',
      template: 'ni-number'
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
      }]
    },
    '/partner-add-other-name': {
      backLink: 'partner-has-other-names',
      fields: ['partnerOtherName'],
      next: '/partner-other-names',
      continueOnEdit: true
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
      next: '/has-dependants'
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
      }]
    },
    '/add-dependant': {
      backLink: 'has-dependants',
      fields: [
        'dependantFullName',
        'dependantDateOfBirth',
        'dependantRelationship'
      ],
      behaviours: [setDateErrorLink],
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
      next: '/address'
    },
    '/address': {
      behaviours: [AddSpacePostcode],
      fields: ['building', 'street', 'townOrCity', 'postcode'],
      next: '/income',
      forks: [{
        target: '/combined-income',
        condition: {
          field: 'joint',
          value: 'yes'
        }
      }]
    },
    '/income': {
      behaviours: [RemovePrefix],
      fields: [
        'incomeTypes',
        'salaryAmount',
        'universalCreditAmount',
        'childBenefitAmount',
        'housingBenefitAmount',
        'otherIncomeAmount',
        'otherIncomeExplain'
      ],
      next: '/outgoings'
    },
    '/outgoings': {
      behaviours: [RemovePrefix],
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
      next: '/savings'
    },
    '/savings': {
      fields: ['savings', 'savingsAmount'],
      behaviours: [setRadioButtonErrorLink, RemovePrefix],
      next: '/amount',
      continueOnEdit: true
    },
    '/amount': {
      behaviours: [RemovePrefix],
      fields: ['amount'],
      next: '/purpose'
    },
    '/combined-income': {
      behaviours: [RemovePrefix],
      fields: [
        'combinedIncomeTypes',
        'combinedSalaryAmount',
        'combinedUniversalCreditAmount',
        'combinedChildBenefitAmount',
        'combinedHousingBenefitAmount',
        'combinedOtherIncomeAmount',
        'combinedOtherIncomeExplain'
      ],
      next: '/combined-outgoings'
    },
    '/combined-outgoings': {
      behaviours: [RemovePrefix],
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
      next: '/combined-savings'
    },
    '/combined-savings': {
      fields: ['combinedSavings', 'combinedSavingsAmount'],
      behaviours: [setRadioButtonErrorLink, RemovePrefix],
      next: '/combined-amount',
      continueOnEdit: true
    },
    '/combined-amount': {
      behaviours: [RemovePrefix],
      fields: ['jointAmount'],
      next: '/purpose'
    },
    '/purpose': {
      fields: ['purposeTypes'],
      next: '/bank-details'
    },
    '/bank-details': {
      fields: ['accountName', 'bankName', 'sortCode', 'accountNumber', 'rollNumber'],
      next: '/contact'
    },
    '/contact': {
      fields: ['contactTypes', 'email', 'phone'],
      next: '/help',
      forks: [{
        target: '/outcome',
        condition: req =>
          req.form.values.contactTypes && !(req.form.values.contactTypes.includes('email'))
      }]
    },
    '/outcome': {
      fields: ['likelyToMove', 'outcomeBuilding', 'outcomeStreet', 'outcomeTownOrCity', 'outcomePostcode'],
      behaviours: [setRadioButtonErrorLink],
      template: 'outcome',
      next: '/help'
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
      }]
    },
    '/help-reasons': {
      fields: ['helpReasons'],
      next: '/who-helped'
    },
    '/who-helped': {
      fields: ['helpFullName', 'helpRelationship', 'helpContactTypes', 'helpEmail', 'helpPhone'],
      next: '/confirm'
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
    },
    '/exit': {}
  }
};

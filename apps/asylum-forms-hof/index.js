'use strict';

const Loop = require('./behaviours/loop');
const SetConfirmStep = require('./behaviours/set-confirm-step');
const LocalSummary = require('./behaviours/summary');
const UploadPDF = require('./behaviours/upload-pdf');

module.exports = {
  name: 'asylum-forms-hof',
  params: '/:action?/:id?/:edit?',
  baseUrl: '/asylum-forms-hof',
  steps: {
    '/index': {
      next: '/previously-applied'
    },
    '/previously-applied': {
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
      next: '/brp'
    },
    '/brp': {
      fields: ['brpNumber', 'fullName', 'dateOfBirth'],
      next: '/ni-number',
      template: 'brp'
    },
    '/ni-number': {
      fields: ['niNumber'],
      next: '/has-other-names'
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
      }]
    },
    '/other-names': {
      behaviours: Loop,
      loopData: {
        storeKey: 'otherNamesList',
        sectionKey: 'other-names',
        confirmStep: '/confirm',
        applySpacer: false
      },
      fields: [
        'otherNames',
        'addAnotherName'
      ],
      firstStep: 'name',
      subSteps: {
        name: {
          fields: ['otherNames'],
          next: 'add-another'
        },
        'add-another': {
          fields: ['addAnotherName'],
          template: 'other-names-add-another'
        }
      },
      loopCondition: {
        field: 'addAnotherName',
        value: 'yes'
      },
      next: '/home-office-reference'
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
      next: '/dependents'
    },
    '/partner-brp': {
      fields: ['partnerBrpNumber', 'partnerFullName', 'partnerDateOfBirth'],
      next: '/partner-ni-number',
      template: 'brp'
    },
    '/partner-ni-number': {
      fields: ['partnerNiNumber'],
      next: '/partner-has-other-names',
      template: 'ni-number'
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
      }]
    },
    '/partner-other-names': {
      behaviours: Loop,
      loopData: {
        storeKey: 'partnerOtherNamesList',
        sectionKey: 'partner-other-names',
        confirmStep: '/confirm',
        applySpacer: false
      },
      fields: [
        'partnerOtherNames',
        'partnerAddAnotherName'
      ],
      firstStep: 'name',
      subSteps: {
        name: {
          fields: ['partnerOtherNames'],
          next: 'add-another'
        },
        'add-another': {
          fields: ['partnerAddAnotherName'],
          template: 'partner-other-names-add-another'
        }
      },
      loopCondition: {
        field: 'partnerAddAnotherName',
        value: 'yes'
      },
      next: '/convictions-joint'
    },
    '/convictions-joint': {
      fields: ['convictedJoint', 'detailsOfCrimeJoint'],
      next: '/dependents'
    },
    '/dependents': {
      fields: ['dependents'],
      next: '/address',
      forks: [{
        target: '/dependent-details',
          condition: {
            field: 'dependents',
            value: 'yes'
          }
      }]
    },
    '/dependent-details': {
      behaviours: Loop,
      loopData: {
        storeKey: 'dependentDetails',
        sectionKey: 'dependent-details',
        confirmStep: '/confirm',
      },
      fields: [
        'dependentFullName',
        'dependentDateOfBirth',
        'dependentRelationship',
        'addAnotherDependant'
      ],
      firstStep: 'dependent',
      subSteps: {
        dependent: {
          fields: ['dependentFullName', 'dependentDateOfBirth', 'dependentRelationship'],
          next: 'add-another'
        },
        'add-another': {
          fields: [
            'addAnotherDependant'
          ],
          template: 'dependents-add-another'
        }
      },
      loopCondition: {
        field: 'addAnotherDependant',
        value: 'yes'
      },
      next: '/address'
    },
    '/address': {
      fields: ['building', 'street', 'townOrCity', 'postcode'],
      next: '/income',
      forks: [{
        target: '/combined-income',
          condition: {
            field: 'partner',
            value: 'yes'
          }
      }]
    },
    '/income': {
      fields: ['incomeTypes', 'salaryAmount', 'universalCreditAmount', 'childBenefitAmount', 'housingBenefitAmount', 'otherIncomeAmount'],
      next: '/outgoings'
    },
    '/outgoings': {
      fields: ['outgoingTypes', 'rentAmount', 'householdBillsAmount', 'foodToiletriesAndCleaningSuppliesAmount', 'mobilePhoneAmount', 'travelAmount', 'clothingAndFootwearAmount', 'universalCreditDeductionsAmount', 'otherOutgoingAmount'],
      next: '/savings'
    },
    '/savings': {
      fields: ['savings', 'savingsAmount'],
      next: '/amount'
    },
    '/amount': {
      fields: ['amount'],
      next: '/purpose'
    },
    '/combined-income': {
      fields: ['incomeTypes'],
      next: '/combined-outgoings'
    },
    '/combined-outgoings': {
      fields: ['outgoingTypes'],
      next: '/combined-savings'
    },
    '/combined-savings': {
      fields: ['combinedSavings', 'combinedSavingsAmount'],
      next: '/combined-amount'
    },
    '/combined-amount': {
      fields: ['jointAmount'],
      next: '/purpose'
    },
    '/purpose': {
      fields: ['purposeTypes'],
      next: '/bank-details'
    },
    '/bank-details': {
      fields: ['accountName', 'sortCode', 'accountNumber', 'rollNumber'],
      next: '/contact'
    },
    '/contact': {
      fields: ['contactTypes', 'email', 'phone'],
      next: '/confirm',
      forks: [{
        target: '/outcome',
        condition: function (req, res) {
          return req.form.values['contactTypes'] && !(req.form.values['contactTypes'].includes('email'));
        }
      }]
    },
    '/outcome': {
      fields: ['likelyToMove', 'outcomeBuilding', 'outcomeStreet', 'outcomeTownOrCity', 'outcomePostcode'],
      template: 'outcome',
      next: '/confirm'
    },
    '/confirm': {
      behaviours: ['complete', require('hof-behaviour-summary-page'), LocalSummary, UploadPDF],
      loopSections: require('./sections/loop-sections'),
      next: '/complete'
    },
    '/complete': {
      template: 'confirmation'
    },
    '/ineligible': {
      template: 'ineligible'
    }
  }
}
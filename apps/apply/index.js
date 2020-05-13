'use strict';

const Loop = require('./behaviours/loop');
const LocalSummary = require('./behaviours/summary');
const UploadPDF = require('./behaviours/upload-pdf');
const UploadFeedback = require('./behaviours/submit-feedback')

module.exports = {
  name: 'apply',
  params: '/:action?/:id?/:edit?',
  baseUrl: '/apply',
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
    '/other-names': {
      behaviours: Loop,
      loopData: {
        storeKey: 'otherNamesList',
        sectionKey: 'other-names',
        confirmStep: '/confirm',
        applySpacer: false,
        firstFieldAsHeader: true
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
      next: '/dependents',
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
    '/partner-other-names': {
      behaviours: Loop,
      loopData: {
        storeKey: 'partnerOtherNamesList',
        sectionKey: 'partner-other-names',
        confirmStep: '/confirm',
        applySpacer: false,
        firstFieldAsHeader: true
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
      next: '/convictions-joint',
      continueOnEdit: true
    },
    '/convictions-joint': {
      fields: ['convictedJoint', 'detailsOfCrimeJoint'],
      next: '/dependents',
      continueOnEdit: true
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
      }],
      continueOnEdit: true
    },
    '/dependent-details': {
      behaviours: Loop,
      loopData: {
        storeKey: 'dependentDetails',
        sectionKey: 'dependent-details',
        confirmStep: '/confirm',
        firstFieldAsHeader: true,
        editFieldsIndividually: false
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
      fields: ['incomeTypes', 'salaryAmount', 'universalCreditAmount', 'childBenefitAmount', 'housingBenefitAmount', 'otherIncomeAmount'],
      next: '/outgoings',
      continueOnEdit: true
    },
    '/outgoings': {
      fields: ['outgoingTypes', 'rentAmount', 'householdBillsAmount', 'foodToiletriesAndCleaningSuppliesAmount', 'mobilePhoneAmount', 'travelAmount', 'clothingAndFootwearAmount', 'universalCreditDeductionsAmount', 'otherOutgoingAmount'],
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
      fields: ['combinedIncomeTypes', 'combinedSalaryAmount', 'combinedUniversalCreditAmount', 'combinedChildBenefitAmount', 'combinedHousingBenefitAmount', 'combinedOtherIncomeAmount'],
      next: '/combined-outgoings',
      continueOnEdit: true
    },
    '/combined-outgoings': {
      fields: ['combinedOutgoingTypes', 'combinedRentAmount', 'combinedHouseholdBillsAmount', 'combinedFoodToiletriesAndCleaningSuppliesAmount', 'combinedMobilePhoneAmount', 'combinedTravelAmount', 'combinedClothingAndFootwearAmount', 'combinedUniversalCreditDeductionsAmount', 'combinedOtherOutgoingAmount'],
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
        condition: function (req, res) {
          return req.form.values['contactTypes'] && !(req.form.values['contactTypes'].includes('email'));
        }
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
    },
    '/feedback': {
        fields: ['feedbackText', 'feedbackName', 'feedbackEmail'],
        feedbackEmailConfig: {
            fieldMappings: {
                'feedbackText': 'feedback',
                'feedbackName' : 'name',
                'feedbackEmail' : ' email'
            },
            includeBaseUrlAs : "process",
            includeSourcePathAs : "path"
        },
        behaviours: [UploadFeedback]
    }
  }
}
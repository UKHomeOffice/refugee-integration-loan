'use strict';

module.exports = {
  name: 'asylum-forms-hof',
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
      next: '/other-names'
    },
    '/other-names': {
      fields: ['hasOtherNames', 'otherNames'],
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
      next: '/partner-ni-number'
    },
    '/partner-ni-number': {
      fields: ['partnerNiNumber'],
      next: '/partner-other-names'
    },
    '/partner-other-names': {
      fields: ['partnerHasOtherNames', 'partnerOtherNames'],
      next: '/convictions-joint'
    },
    '/convictions-joint': {
      fields: ['convicted', 'detailsOfCrime'],
      next: '/dependents'
    },
    '/dependents': {
      fields: ['dependents'],
      next: '/address',
      forks: [{
        target: '/dependent',
          condition: {
            field: 'dependents',
            value: 'yes'
          }
      }]
    },
    '/dependent': {
      fields: ['dependentFullName', 'dependentDateOfBirth', 'dependentRelationship'],
      next: '/address'
    },
    '/address': {
      fields: ['building', 'street', 'townOrCity', 'county', 'postcode'],
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
      fields: ['incomeTypes'],
      next: '/outgoings'
    },
    '/outgoings': {
      fields: ['outgoingTypes'],
      next: '/savings'
    },
    '/savings': {
      fields: ['savings'],
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
      fields: ['savings'],
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
      fields: ['infoContactTypes', 'outcomeContactTypes'],
      next: '/declaration'
    },
    '/declaration': {
      behaviours: ['complete', require('hof-behaviour-summary-page')],
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
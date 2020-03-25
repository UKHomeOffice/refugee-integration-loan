'use strict';

module.exports = {
  name: 'asylum-forms-hof',
  baseUrl: '/asylum-forms-hof',
  steps: {
    '/index': {
      next: '/joint'
    },
    '/joint': {
      fields: ['joint'],
      next: '/humanitarian-refugee-status-date'
    },
    '/humanitarian-refugee-status-date': {
      fields: ['refugeeDate'],
      next: '/employment-status'
    },
    '/employment-status': {
      fields: ['employmentStatus'],
      next: '/brp'
    },
    '/brp': {
      fields: ['fullName', 'dateOfBirth', 'brpNumber'],
      next: '/ni-number'
    },
    '/ni-number': {
      fields: ['niNumber'],
      next: '/home-office-reference'
    },
    '/home-office-reference': {
      fields: ['homeOfficeReference'],
      next: '/address'
    },
    '/address': {
      fields: ['building', 'street', 'townOrCity', 'county', 'postcode'],
      next: '/income'
    },
    '/income': {
      fields: ['incomeTypes'],
      next: '/outgoings'
    },
    '/outgoings': {
      fields: ['outgoingTypes'],
      next: '/debts'
    },
    '/debts': {
      fields: ['debts'],
      next: '/savings'
    },
    '/savings': {
      fields: ['savings'],
      next: '/purpose'
    },
    '/purpose': {
      fields: ['purposeTypes'],
      next: '/previous'
    },
    '/previous': {
      fields: ['previouslyHadIntegrationLoan'],
      next: '/payment'
    },
    '/payment': {
      fields: ['paymentType'],
      next: '/bank-details',
      forks: [{
          target: '/aspen-details',
          condition: {
              field: 'paymentType',
              value: 'aspen_card'
          }
      }]
    },
    '/bank-details': {
      fields: ['accountName', 'sortCode', 'accountNumber', 'rollNumber'],
      next: '/contact'
    },
    '/aspen-details': {
      fields: ['aspenNumber'],
      next: '/contact'
    },
    '/contact': {
      fields: ['contactTypes'],
      next: '/declaration'
    },
    '/declaration': {
      template: 'declaration',
      next: '/complete'
    },
    '/complete': {
      template: 'confirmation'
    }
  }
};

'use strict';

const _ = require('lodash');
const dateComponent = require('hof-component-date');

function singleLoanAmount(values) {
  return between(values, 100, 500)
}

function jointLoanAmount(values) {
  return between(values, 100, 780)
}

function between(values, min, max) {
  values = _.castArray(values);
  if(values.length == 1) {
    const value = Number(values[0])
    return value >=min && value <= max
  }
  return true
}

function decimal(value) {
  return regex(value, /^\d*.?\d{0,2}$/)
}

function phoneNumber(value) {
  return regex(stripSpaces(value), /^\(?\+?[\d() -]{0,15}$/)
}

function emailAddress(value) {
  return regex(value, /^[\w-\.\+]+@([\w-]+\.)+[\w-]+$/)
}

function niNumber(value) {
  return regex(stripSpaces(value), /^[ABCEGHJKLMNOPRSTWXYZ][ABCEGHJKLMNPRSTWXYZ][0-9]{6}[A-D]$/)
}

function regex(value, match) {
    return typeof value === 'string' && !!value.match(match)
}

function stripSpaces(str) {
    return str.split(' ').join('')
}

module.exports = {
  previouslyApplied: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
  },
  previouslyHadIntegrationLoan: {
   mixin: 'radio-group',
   options: ['yes', 'no'],
   validate: 'required'
  },
  whoReceivedPreviousLoan: {
   mixin: 'radio-group',
   options: ['me', 'partner', 'someoneElse'],
   validate: 'required'
  },
  partner: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
  },
  joint: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
  },
  refugeeDate: dateComponent('refugeeDate', {
                   validate: ['required', 'before']
             }),
  dateOfBirth: dateComponent('dateOfBirth', {
    validate: ['required', 'before']
  }),
  fullName: {
   validate: 'required'
  },
  brpNumber: {
   validate: ['required', {type:'regex', arguments: '^[A-Z]{2}[X0-9]\\d{6}$'}]
  },
  niNumber: {
   validate: ['required', niNumber]
  },
  hasOtherNames: {
   mixin: 'radio-group',
   options: ['yes', 'no'],
   validate: 'required'
  },
  otherNames: {
   validate: 'required'
  },
  addAnotherDependant: {
   omitFromSummary: true
  },
  addAnotherName: {
   omitFromSummary: true
  },
  partnerAddAnotherName: {
   omitFromSummary: true
  },
  homeOfficeReference: {
   validate: ['required', {type:'regex', arguments: '^[A-Z]\\d{7}$'}]
  },
  convicted: {
    mixin: 'radio-group',
    options: [{
            value: 'yes',
            toggle: 'detailsOfCrime',
            child: 'partials/details-summary'
        },
        {
            value: 'no'
        }
    ],
    validate: 'required'
   },
   detailsOfCrime: {
    validate: 'required',
    dependent: {
      field: 'convicted',
      value: 'yes'
    }
   },
  convictedJoint: {
    mixin: 'radio-group',
    options: [{
            value: 'yes',
            toggle: 'detailsOfCrimeJoint',
            child: 'partials/details-summary'
        },
        {
            value: 'no'
        }
    ],
    validate: 'required'
  },
  detailsOfCrimeJoint: {
    validate: 'required',
    dependent: {
      field: 'convictedJoint',
      value: 'yes'
    }
  },
  partnerDateOfBirth: dateComponent('partnerDateOfBirth', {
   validate: ['required', 'before']
  }),
  partnerFullName: {
   validate: 'required',
   className: "govuk-input"
  },
  partnerBrpNumber: {
   validate: ['required', {type:'regex', arguments: '^[A-Z]{2}[X0-9]\\d{6}$'}],
   className: "govuk-input govuk-input--width-10"
  },
  partnerNiNumber: {
   validate: ['required', niNumber]
  },
  partnerHasOtherNames: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
   },
   partnerOtherNames: {
    validate: 'required'
   },
  dependents: {
   mixin: 'radio-group',
   options: ['yes', 'no'],
   validate: 'required'
  },
  dependentFullName: {
   validate: 'required'
  },
  dependentDateOfBirth: dateComponent('dependentDateOfBirth', {
   validate: ['required', 'before']
  }),
  dependentRelationship: {
   validate: 'required'
  },
  'addAnother': {
      mixin: 'radio-group',
      legend: {
        className: 'visuallyhidden'
      },
      validate: 'required',
      options: [
        'yes',
        'no'
      ]
  },
  building: {
   validate: 'required'
  },
  street: {
  },
  townOrCity: {
   validate: 'required'
  },
  postcode: {
   validate: ['required', 'postcode']
  },
  incomeTypes: {
   mixin: 'checkbox-group',
   options: [
       {
           value: 'salary',
           toggle: 'salaryAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'universal_credit',
           toggle: 'universalCreditAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'child_benefit',
           toggle: 'childBenefitAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'housing_benefit',
           toggle: 'housingBenefitAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'other',
           toggle: 'otherIncomeAmount',
           child: 'partials/details-summary'
       }
   ]
  },
  salaryAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'salary'
   }
  },
  universalCreditAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'universal_credit'
   }
  },
  childBenefitAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'child_benefit'
   }
  },
  housingBenefitAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'housing_benefit'
   }
  },
  otherIncomeAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'other'
   }
  },
  outgoingTypes: {
   mixin: 'checkbox-group',
   options: [
       {
           value: 'rent',
           toggle: 'rentAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'household_bills',
           toggle: 'householdBillsAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'food_toiletries_cleaning_supplies',
           toggle: 'foodToiletriesAndCleaningSuppliesAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'mobile_phone',
           toggle: 'mobilePhoneAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'travel',
           toggle: 'travelAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'clothing_and_footwear',
           toggle: 'clothingAndFootwearAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'universal_credit_deductions',
           toggle: 'universalCreditDeductionsAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'other',
           toggle: 'otherOutgoingAmount',
           child: 'partials/details-summary'
       }
   ]
  },
  rentAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'rent'
   }
  },
  householdBillsAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'household_bills'
   }
  },
  foodToiletriesAndCleaningSuppliesAmount: {
   attributes: [{attribute: 'placeholder', value: '£'}],
   validate: ['required', decimal],
   dependent: {
     field: 'outgoingTypes',
     value: 'food_toiletries_cleaning_supplies'
   }
  },
  mobilePhoneAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'mobile_phone'
   }
  },
  travelAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'travel'
   }
  },
  clothingAndFootwearAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'clothing_and_footwear'
   }
  },
  universalCreditDeductionsAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'universal_credit_deductions'
   }
  },
  otherOutgoingAmount: {
   validate: ['required', decimal],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'other'
   }
  },
  savings: {
   mixin: 'radio-group',
   options: [
       {
           value: 'yes',
           toggle: 'savingsAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'no'
       }
   ],
   validate: 'required'
  },
  savingsAmount: {
   validate: 'required',
   attributes: [ {attribute:'placeholder', value:'£'} ],
   dependent: {
     field: 'savings',
     value: 'yes'
   }
  },
  combinedSavings: {
   mixin: 'radio-group',
   options: [
       {
           value: 'yes',
           toggle: 'combinedSavingsAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'no'
       }
   ],
   validate: 'required'
  },
  combinedSavingsAmount: {
   validate: 'required',
   attributes: [ {attribute:'placeholder', value:'£'} ],
   dependent: {
     field: 'combinedSavings',
     value: 'yes'
   }
  },
  amount: {
   validate: ['required', decimal, singleLoanAmount],
   attributes: [{attribute: 'placeholder', value: '£'}]
  },
  jointAmount: {
   attributes: [{attribute: 'placeholder', value: '£'}],
   validate: ['required', decimal, jointLoanAmount]
  },
  purposeTypes: {
   mixin: 'checkbox-group',
   options: ['housing', 'essential_items', 'basic_living_costs', 'training_or_retraining', 'work_clothing_and_equipment'],
   validate: 'required'
  },
  accountName: {
   validate: 'required'
  },
  sortCode: {
   validate: ['required', 'numeric', {type: 'exactlength', arguments: 6}]
  },
  accountNumber: {
   validate: ['required', 'numeric', {type: 'minlength', arguments: 6}, {type: 'maxlength', arguments: 8}]
  },
  rollNumber: {
  },
  contactTypes: {
   mixin: 'checkbox-group',
   options: [
     {
        value: 'email',
        toggle: 'email',
        child: 'partials/details-summary'
     },
     {
        value: 'phone',
        toggle: 'phone',
        child: 'partials/details-summary'
     }
   ],
   validate: 'required'
  },
  email: {
   validate: ['required', 'email'],
   dependent: {
     field: 'contactTypes',
     value: 'email'
   }
  },
  phone: {
   validate: ['required', phoneNumber],
   dependent: {
     field: 'contactTypes',
     value: 'phone'
   }
  },
  likelyToMove: {
    mixin: 'radio-group',
    options: [
      {
        value: 'yes',
        toggle: 'outcome-address',
        child: 'partials/outcome-address'
      },
      {
        value: 'no'
      }
    ],
    validate: 'required'
  },
  outcomeBuilding: {
   validate: 'required',
   dependent: {
     field: 'likelyToMove',
     value: 'yes'
   }
  },
  outcomeStreet: {
   dependent: {
     field: 'likelyToMove',
     value: 'yes'
   }
  },
  outcomeTownOrCity: {
   validate: 'required',
   dependent: {
     field: 'likelyToMove',
     value: 'yes'
   }
  },
  outcomePostcode: {
   validate: ['required', 'postcode'],
   dependent: {
     field: 'likelyToMove',
     value: 'yes'
   }
  },
  hadHelp: {
   mixin: 'radio-group',
   validate: ['required'],
   options: ['yes', 'no']
  },
  helpReasons: {
   mixin: 'checkbox-group',
   validate: ['required'],
   options: ['no_internet', 'english_not_first_language', 'not_confident', 'faster', 'health_condition']
  },
  helpFullName: {
   validate: 'required'
  },
  helpRelationship: {
   validate: 'required'
  },
  helpContactTypes: {
   mixin: 'checkbox-group',
   options: [
     {
        value: 'email',
        toggle: 'helpEmail',
        child: 'partials/details-summary'
     },
     {
        value: 'phone',
        toggle: 'helpPhone',
        child: 'partials/details-summary'
     }
   ],
   validate: 'required'
  },
  helpEmail: {
   validate: ['required', 'email'],
   dependent: {
     field: 'helpContactTypes',
     value: 'email'
   }
  },
  helpPhone: {
   validate: ['required', phoneNumber],
   dependent: {
     field: 'helpContactTypes',
     value: 'phone'
   }
  }
}
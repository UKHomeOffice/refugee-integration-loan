'use strict';

const _ = require('lodash');
const dateComponent = require('hof-component-date');
const libPhoneNumber = require('libphonenumber-js/max');
const moment = require('moment');
const config = require('../../../config')

const after1900Validator = {type: 'after', arguments:['1900']}
const olderThan18Validator = {type: 'before', arguments:['18', 'years']}

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
  return regex(value, /^[\d]*\.?\d{0,2}$/)
}

function greaterThanZero(value) {
  return Number(value) > 0;
}

function mobilePhoneNumber(value) {
    const phoneNumber = libPhoneNumber.parsePhoneNumberFromString(value, 'GB');
    return phoneNumber && phoneNumber.isValid() && (phoneNumber.getType().includes('MOBILE') || phoneNumber.getType() === 'PERSONAL_NUMBER');
}

function ukPhoneNumber(value) {
    const phoneNumber = libPhoneNumber.parsePhoneNumberFromString(value, 'GB');
    return phoneNumber && phoneNumber.isValid() && phoneNumber.country === 'GB';
}

function emailAddress(value) {
  return value && value.trim() !== '' ? regex(value, /^[\w-\.\+]+@([\w-]+\.)+[\w-]+$/) : true;
}

function niNumber(value) {
  return regex(stripSpaces(value.toUpperCase()), /^[ABCEGHJKLMNOPRSTWXYZ][ABCEGHJKLMNPRSTWXYZ][0-9]{6}[A-D]$/)
}

function brpNumber(str) {
    return regex(stripSpaces(str.toUpperCase()), /^[A-Z0-9]{9}$/)
}

function postcode(str) {
    const value = stripSpaces(str.toUpperCase())
    //regex sourced from notify (https://github.com/alphagov/notifications-utils/blob/master/notifications_utils/postal_address.py)
    return regex(value, /^([A-Z]{1,2}[0-9][0-9A-Z]?[0-9][A-BD-HJLNP-UW-Z]{2})$/)
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
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  previouslyHadIntegrationLoan: {
   mixin: 'radio-group',
   options: ['yes', 'no'],
   validate: 'required',
   legend: {
     className: 'visuallyhidden'
   }
  },
  whoReceivedPreviousLoan: {
   mixin: 'radio-group',
   options: ['me', 'partner', 'someoneElse'],
   validate: 'required',
   legend: {
     className: 'visuallyhidden'
   }
  },
  partner: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  joint: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  dateOfBirth: dateComponent('dateOfBirth', {
        validate: ['required', after1900Validator, olderThan18Validator]
  }),
  fullName: {
   validate: 'required'
  },
  brpNumber: {
   validate: ['required', brpNumber]
  },
  niNumber: {
   validate: ['required', niNumber]
  },
  hasOtherNames: {
   mixin: 'radio-group',
   options: ['yes', 'no'],
   validate: 'required',
   legend: {
     className: 'visuallyhidden'
   }
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
   validate: ['required']
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
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
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
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  detailsOfCrimeJoint: {
    validate: 'required',
    dependent: {
      field: 'convictedJoint',
      value: 'yes'
    }
  },
  partnerDateOfBirth: dateComponent('partnerDateOfBirth', {
   validate: ['required', 'before', after1900Validator]
  }),
  partnerFullName: {
   validate: 'required',
   className: "govuk-input"
  },
  partnerBrpNumber: {
   validate: ['required', brpNumber],
   className: "govuk-input govuk-input--width-10"
  },
  partnerNiNumber: {
   validate: ['required', niNumber]
  },
  partnerHasOtherNames: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
   },
   partnerOtherNames: {
    validate: 'required'
   },
  dependents: {
   mixin: 'radio-group',
   options: ['yes', 'no'],
   validate: 'required',
   legend: {
     className: 'visuallyhidden'
   }
  },
  dependentFullName: {
   validate: 'required'
  },
  dependentDateOfBirth: dateComponent('dependentDateOfBirth', {
   validate: ['required', 'before', after1900Validator],
   parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
  }),
  dependentRelationship: {
   validate: 'required'
  },
  building: {
   validate: 'required'
  },
  street: {
    labelClassName: 'visuallyhidden'
  },
  townOrCity: {
   validate: 'required'
  },
  postcode: {
   validate: ['required', postcode]
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
   ],
    legend: {
      className: 'visuallyhidden'
    },
    validate: 'required'
  },
  salaryAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'salary'
   }
  },
  universalCreditAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'universal_credit'
   }
  },
  childBenefitAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'child_benefit'
   }
  },
  housingBenefitAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'housing_benefit'
   }
  },
  otherIncomeAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'incomeTypes',
     value: 'other'
   }
  },
  combinedIncomeTypes: {
   mixin: 'checkbox-group',
   options: [
       {
           value: 'salary',
           toggle: 'combinedSalaryAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'universal_credit',
           toggle: 'combinedUniversalCreditAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'child_benefit',
           toggle: 'combinedChildBenefitAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'housing_benefit',
           toggle: 'combinedHousingBenefitAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'other',
           toggle: 'combinedOtherIncomeAmount',
           child: 'partials/details-summary'
       }
   ],
   legend: {
     className: 'visuallyhidden'
   },
   validate: 'required'
  },
  combinedSalaryAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedIncomeTypes',
     value: 'salary'
   }
  },
  combinedUniversalCreditAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedIncomeTypes',
     value: 'universal_credit'
   }
  },
  combinedChildBenefitAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedIncomeTypes',
     value: 'child_benefit'
   }
  },
  combinedHousingBenefitAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedIncomeTypes',
     value: 'housing_benefit'
   }
  },
  combinedOtherIncomeAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedIncomeTypes',
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
   ],
   legend: {
     className: 'visuallyhidden'
   },
   validate: 'required'
  },
  rentAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'rent'
   }
  },
  householdBillsAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'household_bills'
   }
  },
  foodToiletriesAndCleaningSuppliesAmount: {
   attributes: [{attribute: 'placeholder', value: '£'}],
   validate: ['required', decimal, greaterThanZero],
   dependent: {
     field: 'outgoingTypes',
     value: 'food_toiletries_cleaning_supplies'
   }
  },
  mobilePhoneAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'mobile_phone'
   }
  },
  travelAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'travel'
   }
  },
  clothingAndFootwearAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'clothing_and_footwear'
   }
  },
  universalCreditDeductionsAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'universal_credit_deductions'
   }
  },
  otherOutgoingAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'outgoingTypes',
     value: 'other'
   }
  },
  combinedOutgoingTypes: {
   mixin: 'checkbox-group',
   options: [
       {
           value: 'rent',
           toggle: 'combinedRentAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'household_bills',
           toggle: 'combinedHouseholdBillsAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'food_toiletries_cleaning_supplies',
           toggle: 'combinedFoodToiletriesAndCleaningSuppliesAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'mobile_phone',
           toggle: 'combinedMobilePhoneAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'travel',
           toggle: 'combinedTravelAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'clothing_and_footwear',
           toggle: 'combinedClothingAndFootwearAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'universal_credit_deductions',
           toggle: 'combinedUniversalCreditDeductionsAmount',
           child: 'partials/details-summary'
       },
       {
           value: 'other',
           toggle: 'combinedOtherOutgoingAmount',
           child: 'partials/details-summary'
       }
   ],
   legend: {
     className: 'visuallyhidden'
   },
   validate: 'required'
  },
  combinedRentAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedOutgoingTypes',
     value: 'rent'
   }
  },
  combinedHouseholdBillsAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedOutgoingTypes',
     value: 'household_bills'
   }
  },
  combinedFoodToiletriesAndCleaningSuppliesAmount: {
   attributes: [{attribute: 'placeholder', value: '£'}],
   validate: ['required', decimal, greaterThanZero],
   dependent: {
     field: 'combinedOutgoingTypes',
     value: 'food_toiletries_cleaning_supplies'
   }
  },
  combinedMobilePhoneAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedOutgoingTypes',
     value: 'mobile_phone'
   }
  },
  combinedTravelAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedOutgoingTypes',
     value: 'travel'
   }
  },
  combinedClothingAndFootwearAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedOutgoingTypes',
     value: 'clothing_and_footwear'
   }
  },
  combinedUniversalCreditDeductionsAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedOutgoingTypes',
     value: 'universal_credit_deductions'
   }
  },
  combinedOtherOutgoingAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [{attribute: 'placeholder', value: '£'}],
   dependent: {
     field: 'combinedOutgoingTypes',
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
   validate: 'required',
   legend: {
     className: 'visuallyhidden'
   }
  },
  savingsAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [ {attribute: 'placeholder', value:'£'} ],
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
   validate: 'required',
   legend: {
     className: 'visuallyhidden'
   }
  },
  combinedSavingsAmount: {
   validate: ['required', decimal, greaterThanZero],
   attributes: [ {attribute: 'placeholder', value:'£'} ],
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
   validate: 'required',
   legend: {
     className: 'visuallyhidden'
   }
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
   validate: 'required',
   legend: {
     className: 'visuallyhidden'
   }
  },
  email: {
   validate: ['required', 'email'],
   dependent: {
     field: 'contactTypes',
     value: 'email'
   }
  },
  phone: {
   validate: ['required', mobilePhoneNumber],
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
   },
   labelClassName: 'visuallyhidden'
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
   options: ['yes', 'no'],
   legend: {
     className: 'visuallyhidden'
   }
  },
  helpReasons: {
   mixin: 'checkbox-group',
   validate: ['required'],
   options: ['no_internet', 'english_not_first_language', 'not_confident', 'faster', 'health_condition'],
   legend: {
    className: 'visuallyhidden'
   }
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
   validate: ['required', ukPhoneNumber],
   dependent: {
     field: 'helpContactTypes',
     value: 'phone'
   }
  }
}
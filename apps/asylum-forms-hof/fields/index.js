'use strict';

const dateComponent = require('hof-component-date');

module.exports = {
  joint: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
  },
  refugeeDate: dateComponent('refugeeDate', {
                   validate: ['required', 'before']
             }),
  employmentStatus: {
    mixin: 'radio-group',
    options: ['unemployed', 'work_part_time', 'work_full_time', 'self_employed', 'retired', 'full_time_student'],
    validate: 'required'
  },

  dateOfBirth: dateComponent('dateOfBirth', {
                     validate: ['required', 'before']
               }),
   fullName: {
    validate: 'required',
    className: "govuk-input"
   },
   brpNumber: {
    validate: 'required',
    className: "govuk-input govuk-input--width-10"
   },
   niNumber: {
    validate: 'required'
   },
   homeOfficeReference: {
    validate: 'required'
   },
   building: {
    validate: 'required'
   },
   street: {
    validate: 'required'
   },
   townOrCity: {
    validate: 'required'
   },
   county: {
    validate: 'required'
   },
   postcode: {
    validate: ['required', 'postcode']
   },
   incomeTypes: {
    mixin: 'checkbox-group',
    options: ['salary', 'universal_credit', 'child_maintenance_or_support', 'other']
   },
   outgoingTypes: {
    mixin: 'checkbox-group',
    options: ['rent', 'household_bills', 'food_toiletries_cleaning_supplies', 'mobile_phone', 'travel', 'clothing_and_footwear', 'other']
   },
   debts: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
   },
   savings: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
   },
   purposeTypes: {
    mixin: 'checkbox-group',
    options: ['housing', 'essential_items', 'basic_living_costs', 'training_or_retraining', 'work_clothing_and_equipment'],
    validate: 'required'
   },
   previouslyHadIntegrationLoan: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
   },
   paymentType: {
    mixin: 'radio-group',
    options: ['bank_account', 'aspen_card'],
    validate: 'required'
   },
   aspenNumber: {
    validate: 'required'
   },
   accountName: {
    validate: 'required'
   },
   sortCode: {
    validate: 'required'
   },
   accountNumber: {
    validate: 'required'
   },
   rollNumber: {
   },
   contactTypes: {
       mixin: 'checkbox-group',
       options: ['email', 'text_message', 'post'],
       validate: 'required'
   }
};

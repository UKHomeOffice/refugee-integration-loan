'use strict';

const dateComponent = require('hof-component-date');

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
    validate: 'required',
    className: "govuk-input"
   },
   brpNumber: {
    validate: ['required', {type:'regex', arguments: '^[A-Z]{2}[X0-9]\\d{6}$'}]
   },
   niNumber: {
    validate: ['required', {type:'regex', arguments:'^[ABCEGHJKLMNOPRSTWXYZ][ABCEGHJKLMNPRSTWXYZ][0-9]{6}[A-D]$'}]
   },
   hasOtherNames: {
    mixin: 'radio-group',
    options: [{
            value: 'yes',
            toggle: 'otherNames',
            child: 'partials/details-summary'
        },
        {
            value: 'no'
        }
    ],
    validate: 'required'
   },
   otherNames: {
    validate: 'required',
    dependent: {
      field: 'hasOtherNames',
      value: 'yes'
    }
   },
   homeOfficeReference: {
    validate: ['required', {type:'regex', arguments: '^[A-Z]\\d{7}$'}]
   },
   convicted: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required'
   },
   detailsOfCrime: {
    validate: 'required'
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
    validate: ['required', {type:'regex', arguments:'^[ABCEGHJKLMNOPRSTWXYZ][ABCEGHJKLMNPRSTWXYZ][0-9]{6}[A-D]$'}]
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
            value: 'child_maintenance_or_support',
            toggle: 'childMaintenanceOrSupportAmount',
            child: 'partials/details-summary'
        },
        {
            value: 'other',
            toggle: 'otherAmount',
            child: 'partials/details-summary'
        }
    ]
   },
   salaryAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'incomeTypes',
      value: 'salary'
    }
   },
   universalCreditAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'incomeTypes',
      value: 'universal_credit'
    }
   },
   childMaintenanceOrSupportAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'incomeTypes',
      value: 'child_maintenance_or_support'
    }
   },
   otherAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'incomeTypes',
      value: 'other'
    }
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
   amount: {
    validate: 'required'
   },
   jointAmount: {
    validate: 'required'
   },
   purposeTypes: {
    mixin: 'checkbox-group',
    options: ['housing', 'essential_items', 'basic_living_costs', 'training_or_retraining', 'work_clothing_and_equipment'],
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
   infoContactTypes: {
       mixin: 'checkbox-group',
       options: ['email', 'phone'],
       validate: 'required'
   },
   outcomeContactTypes: {
       mixin: 'checkbox-group',
       options: ['email', 'post'],
       validate: 'required'
   }
};

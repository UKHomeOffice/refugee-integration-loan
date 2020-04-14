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
            toggle: 'otherIncomeAmount',
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
   otherIncomeAmount: {
    validate: ['required', 'numeric'],
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
    validate: ['required', 'numeric'],
    dependent: {
      field: 'outgoingTypes',
      value: 'rent'
    }
   },
   householdBillsAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'outgoingTypes',
      value: 'household_bills'
    }
   },
   foodToiletriesAndCleaningSuppliesAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'outgoingTypes',
      value: 'food_toiletries_cleaning_supplies'
    }
   },
   mobilePhoneAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'outgoingTypes',
      value: 'mobile_phone'
    }
   },
   travelAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'outgoingTypes',
      value: 'travel'
    }
   },
   clothingAndFootwearAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'outgoingTypes',
      value: 'clothing_and_footwear'
    }
   },
   universalCreditDeductionsAmount: {
    validate: ['required', 'numeric'],
    dependent: {
      field: 'outgoingTypes',
      value: 'universal_credit_deductions'
    }
   },
   otherOutgoingAmount: {
    validate: ['required', 'numeric'],
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
    validate: ['required', 'numeric'],
    dependent: {
      field: 'savings',
      value: 'yes'
    }
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

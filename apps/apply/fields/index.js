'use strict';

const moment = require('moment');
const config = require('../../../config');
const dateComponent = require('hof-component-date');

const after1900Validator = { type: 'after', arguments: ['1900'] };

const niNumber = {
  type: 'regex',
  arguments: /^[ABCEGHJKLMNOPRSTWXYZ][ABCEGHJKLMNPRSTWXYZ][0-9]{6}[A-D]$/
};

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
    validate: ['required', after1900Validator, 'before', 'over18']
  }),
  fullName: {
    validate: ['required', { type: 'maxlength', arguments: 200 }]
  },
  brpNumber: {
    validate: ['required', 'alphanum', { type: 'exactlength', arguments: 9 }],
    formatter: ['uppercase']
  },
  niNumber: {
    validate: ['required', niNumber],
    formatter: ['removespaces', 'uppercase']
  },
  hasOtherNames: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  otherName: {
    validate: ['required', { type: 'maxlength', arguments: 200 }]
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
    validate: ['required', after1900Validator, 'before', 'over18']
  }),
  partnerFullName: {
    validate: ['required', { type: 'maxlength', arguments: 200 }],
    className: 'govuk-input'
  },
  partnerBrpNumber: {
    formatter: ['removespaces', 'uppercase'],
    className: 'govuk-input govuk-input--width-10',
    validate: ['required', 'alphanum', { type: 'exactlength', arguments: 9 }],
  },
  partnerNiNumber: {
    validate: ['required', niNumber],
    formatter: ['removespaces', 'uppercase']
  },
  partnerHasOtherNames: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  partnerOtherName: {
    validate: ['required', { type: 'maxlength', arguments: 200 }]
  },
  hasDependants: {
    mixin: 'radio-group',
    options: ['yes', 'no'],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  dependantFullName: {
    validate: ['required', { type: 'maxlength', arguments: 200 }]
  },
  dependantDateOfBirth: dateComponent('dependantDateOfBirth', {
    validate: ['required', 'before', after1900Validator],
    parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
  }),
  dependantRelationship: {
    validate: ['required', { type: 'maxlength', arguments: 100 }]
  },
  building: {
    validate: ['required', { type: 'maxlength', arguments: 100 }]
  },
  street: {
    validate: [{ type: 'maxlength', arguments: 50 }],
    labelClassName: 'visuallyhidden'
  },
  townOrCity: {
    validate: ['required', { type: 'maxlength', arguments: 100 }]
  },
  postcode: {
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase']
  },
  incomeTypes: {
    mixin: 'checkbox-group',
    options: [
      {
        value: 'salary',
        toggle: 'salaryAmount',
        child: 'partials/details-summary',
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
    validate: ['required']
  },
  salaryAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'salary',
    }
  },
  universalCreditAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'universal_credit'
    }
  },
  childBenefitAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'child_benefit'
    }
  },
  housingBenefitAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'housing_benefit'
    }
  },
  otherIncomeAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ attribute: 'placeholder', value: '£' }],
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
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'salary'
    }
  },
  combinedUniversalCreditAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'universal_credit'
    }
  },
  combinedChildBenefitAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'child_benefit'
    }
  },
  combinedHousingBenefitAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'housing_benefit'
    }
  },
  combinedOtherIncomeAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
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
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'rent'
    }
  },
  householdBillsAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'household_bills'
    }
  },
  foodToiletriesAndCleaningSuppliesAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'food_toiletries_cleaning_supplies'
    }
  },
  mobilePhoneAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'mobile_phone'
    }
  },
  travelAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'travel'
    }
  },
  clothingAndFootwearAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'clothing_and_footwear'
    }
  },
  universalCreditDeductionsAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'universal_credit_deductions'
    }
  },
  otherOutgoingAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
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
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'rent'
    }
  },
  combinedHouseholdBillsAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'household_bills'
    }
  },
  combinedFoodToiletriesAndCleaningSuppliesAmount: {
    attributes: [{ attribute: 'placeholder', value: '£' }],
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'food_toiletries_cleaning_supplies'
    }
  },
  combinedMobilePhoneAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'mobile_phone'
    }
  },
  combinedTravelAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'travel'
    }
  },
  combinedClothingAndFootwearAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'clothing_and_footwear'
    }
  },
  combinedUniversalCreditDeductionsAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'universal_credit_deductions'
    }
  },
  combinedOtherOutgoingAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
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
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
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
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ attribute: 'placeholder', value: '£' }],
    dependent: {
      field: 'combinedSavings',
      value: 'yes'
    }
  },
  amount: {
    validate: ['required', 'decimal', { type: 'between', arguments: [100, 500] }],
    attributes: [{ attribute: 'placeholder', value: '£' }]
  },
  jointAmount: {
    attributes: [{ attribute: 'placeholder', value: '£' }],
    validate: ['required', 'decimal', { type: 'between', arguments: [100, 780] }]
  },
  purposeTypes: {
    mixin: 'checkbox-group',
    options: [
      'housing',
      'essential_items',
      'basic_living_costs',
      'training_or_retraining',
      'work_clothing_and_equipment'
    ],
    validate: 'required',
    legend: {
      className: 'visuallyhidden'
    }
  },
  accountName: {
    validate: ['required', { type: 'maxlength', arguments: 100 }]
  },
  sortCode: {
    validate: ['required', { type: 'regex', arguments: /^[0-9]{6}$/ }],
    formatter: ['removehyphens', 'removespaces']
  },
  accountNumber: {
    validate: ['required', 'numeric', { type: 'minlength', arguments: 6 }, { type: 'maxlength', arguments: 8 }]
  },
  rollNumber: {},
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
    validate: ['required', 'ukmobilephone'],
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
    validate: ['required', { type: 'maxlength', arguments: 100 }],
    dependent: {
      field: 'likelyToMove',
      value: 'yes'
    }
  },
  outcomeStreet: {
    validate: [{ type: 'maxlength', arguments: 100 }],
    dependent: {
      field: 'likelyToMove',
      value: 'yes'
    },
    labelClassName: 'visuallyhidden'
  },
  outcomeTownOrCity: {
    validate: ['required', { type: 'maxlength', arguments: 100 }],
    dependent: {
      field: 'likelyToMove',
      value: 'yes'
    }
  },
  outcomePostcode: {
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase'],
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
    validate: ['required', { type: 'maxlength', arguments: 200 }]
  },
  helpRelationship: {
    validate: ['required', { type: 'maxlength', arguments: 100 }]
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
    validate: ['required', 'ukPhoneNumber'],
    dependent: {
      field: 'helpContactTypes',
      value: 'phone'
    }
  }
};

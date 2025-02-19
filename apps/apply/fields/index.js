const moment = require('moment');
const config = require('../../../config');
const dateComponent = require('hof').components.date;

const after1900Validator = { type: 'after', arguments: ['1900'] };

const brpNumber = {
  type: 'regex',
  // Regex matches both BRP and the empty string as BRP is optional
  arguments: /^(?:[a-zA-Z]{2}[xX0-9]{1}\d{6}|)$/
};

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
    mixin: 'input-date',
    validate: ['required', after1900Validator, 'before', 'over18'],
    autocomplete: 'bday',
    legend: {
      className: 'govuk-heading-s bold'
    }
  }),
  fullName: {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 200 }],
    autocomplete: 'name',
    labelClassName: ['govuk-heading-s', 'bold']
  },
  brpNumber: {
    className: ['govuk-input govuk-input--width-10'],
    labelClassName: ['govuk-heading-s', 'bold'],
    validate: [brpNumber],
    formatter: ['uppercase']
  },
  niNumber: {
    className: ['govuk-input govuk-input--width-10'],
    labelClassName: ['govuk-heading-s', 'bold'],
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
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 200 }],
    autocomplete: 'additional-name'
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
    className: ['govuk-input govuk-input--width-10'],
    validate: ['required']
  },
  convicted: {
    mixin: 'radio-group',
    options: [{
      value: 'yes',
      toggle: 'detailsOfCrime',
      child: 'partials/details-summary-textarea'
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
    mixin: 'textarea',
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 500 }],
    dependent: {
      field: 'convicted',
      value: 'yes'
    },
    className: 'govuk-textarea',
    attributes: [{
      attribute: 'rows',
      value: 8
    }]
  },
  convictedJoint: {
    mixin: 'radio-group',
    validate: 'required',
    options: [{
      value: 'yes',
      toggle: 'detailsOfCrimeJoint',
      child: 'partials/details-summary-textarea'
    },
    {
      value: 'no'
    }
    ],
    legend: {
      className: 'visuallyhidden'
    }
  },
  detailsOfCrimeJoint: {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 500 }],
    dependent: {
      field: 'convictedJoint',
      value: 'yes'
    },
    className: 'govuk-textarea',
    attributes: [{
      attribute: 'rows',
      value: 8
    }]
  },
  partnerDateOfBirth: dateComponent('partnerDateOfBirth', {
    mixin: 'input-date',
    validate: ['required', after1900Validator, 'before', 'over18'],
    autocomplete: 'bday',
    legend: {
      className: 'govuk-heading-s bold'
    }
  }),
  partnerFullName: {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 200 }],
    className: 'govuk-input',
    autocomplete: 'name',
    labelClassName: ['govuk-heading-s', 'bold']
  },
  partnerBrpNumber: {
    className: 'govuk-input govuk-input--width-10',
    labelClassName: ['govuk-heading-s', 'bold'],
    validate: [brpNumber],
    formatter: ['removespaces', 'uppercase']
  },
  partnerNiNumber: {
    className: ['govuk-input govuk-input--width-10'],
    labelClassName: ['govuk-heading-s', 'bold'],
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
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 200 }],
    autocomplete: 'additional-name'
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
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 200 }],
    autocomplete: 'name'
  },
  dependantDateOfBirth: dateComponent('dependantDateOfBirth', {
    mixin: 'input-date',
    validate: ['required', 'before', after1900Validator],
    autocomplete: 'bday',
    parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
  }),
  dependantRelationship: {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }]
  },
  building: {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }],
    autocomplete: 'address-line1'
  },
  street: {
    validate: ['notUrl', { type: 'maxlength', arguments: 50 }],
    labelClassName: 'visuallyhidden',
    autocomplete: 'address-line2'
  },
  townOrCity: {
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required', 'notUrl',
      { type: 'regex', arguments: /^([^0-9]*)$/ },
      { type: 'maxlength', arguments: 100 }
    ],
    autocomplete: 'address-level2'
  },
  postcode: {
    className: ['govuk-input', 'govuk-input--width-10'],
    validate: ['required', 'postcode'],
    formatter: ['uppercase', 'removespaces'],
    autocomplete: 'postal-code'
  },
  incomeTypes: {
    mixin: 'checkbox-group',
    options: [
      {
        value: 'salary',
        toggle: 'salaryAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'universal_credit',
        toggle: 'universalCreditAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'child_benefit',
        toggle: 'childBenefitAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'housing_benefit',
        toggle: 'housingBenefitAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'other',
        toggle: 'otherIncomeAmount',
        child: 'partials/details-summary-input-text-textarea-single'
      }
    ],
    legend: {
      className: 'visuallyhidden'
    },
    validate: ['required']
  },
  salaryAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'salary'
    }
  },
  universalCreditAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'universal_credit'
    }
  },
  childBenefitAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'child_benefit'
    }
  },
  housingBenefitAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'housing_benefit'
    }
  },
  otherIncomeAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'incomeTypes',
      value: 'other'
    }
  },
  otherIncomeExplain: {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 200 }],
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
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'universal_credit',
        toggle: 'combinedUniversalCreditAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'child_benefit',
        toggle: 'combinedChildBenefitAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'housing_benefit',
        toggle: 'combinedHousingBenefitAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'other',
        toggle: 'combinedOtherIncomeAmount',
        child: 'partials/details-summary-input-text-textarea-combined'
      }
    ],
    legend: {
      className: 'visuallyhidden'
    },
    validate: 'required'
  },
  combinedSalaryAmount: {
    validate: ['required', { type: 'min', arguments: 0.01 }, 'decimal'],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'salary'
    }
  },
  combinedUniversalCreditAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'universal_credit'
    }
  },
  combinedChildBenefitAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'child_benefit'
    }
  },
  combinedHousingBenefitAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'housing_benefit'
    }
  },
  combinedOtherIncomeAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedIncomeTypes',
      value: 'other'
    }
  },
  combinedOtherIncomeExplain: {
    mixin: 'textarea',
    validate: ['required', { type: 'maxlength', arguments: 200 }],
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
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'household_bills',
        toggle: 'householdBillsAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'food_toiletries_cleaning_supplies',
        toggle: 'foodToiletriesAndCleaningSuppliesAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'mobile_phone',
        toggle: 'mobilePhoneAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'travel',
        toggle: 'travelAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'clothing_and_footwear',
        toggle: 'clothingAndFootwearAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'universal_credit_deductions',
        toggle: 'universalCreditDeductionsAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'other',
        toggle: 'otherOutgoingAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      }
    ],
    legend: {
      className: 'visuallyhidden'
    },
    validate: 'required'
  },
  rentAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'rent'
    }
  },
  householdBillsAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'household_bills'
    }
  },
  foodToiletriesAndCleaningSuppliesAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'food_toiletries_cleaning_supplies'
    }
  },
  mobilePhoneAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'mobile_phone'
    }
  },
  travelAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'travel'
    }
  },
  clothingAndFootwearAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'clothing_and_footwear'
    }
  },
  universalCreditDeductionsAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'outgoingTypes',
      value: 'universal_credit_deductions'
    }
  },
  otherOutgoingAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
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
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'household_bills',
        toggle: 'combinedHouseholdBillsAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'food_toiletries_cleaning_supplies',
        toggle: 'combinedFoodToiletriesAndCleaningSuppliesAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'mobile_phone',
        toggle: 'combinedMobilePhoneAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'travel',
        toggle: 'combinedTravelAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'clothing_and_footwear',
        toggle: 'combinedClothingAndFootwearAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'universal_credit_deductions',
        toggle: 'combinedUniversalCreditDeductionsAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'other',
        toggle: 'combinedOtherOutgoingAmount',
        child: 'partials/details-summary-input-text-checkboxes'
      }
    ],
    legend: {
      className: 'visuallyhidden'
    },
    validate: 'required'
  },
  combinedRentAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'rent'
    }
  },
  combinedHouseholdBillsAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'household_bills'
    }
  },
  combinedFoodToiletriesAndCleaningSuppliesAmount: {
    attributes: [{ prefix: '£' }],
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'food_toiletries_cleaning_supplies'
    }
  },
  combinedMobilePhoneAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'mobile_phone'
    }
  },
  combinedTravelAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'travel'
    }
  },
  combinedClothingAndFootwearAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'clothing_and_footwear'
    }
  },
  combinedUniversalCreditDeductionsAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedOutgoingTypes',
      value: 'universal_credit_deductions'
    }
  },
  combinedOtherOutgoingAmount: {
    validate: ['required', 'decimal', { type: 'min', arguments: 0.01 }],
    attributes: [{ prefix: '£' }],
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
        child: 'partials/details-summary-input-text-radio-buttons'
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
    attributes: [{ prefix: '£' }],
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
        child: 'partials/details-summary-input-text-radio-buttons'
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
    attributes: [{ prefix: '£' }],
    dependent: {
      field: 'combinedSavings',
      value: 'yes'
    }
  },
  amount: {
    validate: ['required', 'decimal', { type: 'between', arguments: [100, 500] }],
    attributes: [{ prefix: '£' }]
  },
  jointAmount: {
    attributes: [{ prefix: '£' }],
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
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }]
  },
  bankName: {
    validate: ['notUrl', 'required', { type: 'maxlength', arguments: 200 }]
  },
  sortCode: {
    className: ['govuk-input govuk-input--width-5'],
    validate: ['required', { type: 'regex', arguments: /^[0-9]{6}$/ }],
    formatter: ['removehyphens', 'removespaces']
  },
  accountNumber: {
    className: ['govuk-input govuk-input--width-10'],
    validate: ['required', 'numeric', { type: 'minlength', arguments: 6 }, { type: 'maxlength', arguments: 8 }]
  },
  rollNumber: {
    className: ['govuk-input govuk-input--width-10'],
    validate: 'notUrl'
  },
  contactTypes: {
    mixin: 'checkbox-group',
    options: [
      {
        value: 'email',
        toggle: 'email',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'phone',
        toggle: 'phone',
        child: 'partials/details-summary-input-text-checkboxes'
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
    },
    autocomplete: 'email'
  },
  phone: {
    className: ['govuk-input', 'govuk-input--width-20'],
    validate: ['required', 'notUrl'],
    dependent: {
      field: 'contactTypes',
      value: 'phone'
    },
    autocomplete: 'tel'
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
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }],
    dependent: {
      field: 'likelyToMove',
      value: 'yes'
    },
    autocomplete: 'address-line1'
  },
  outcomeStreet: {
    validate: ['notUrl', { type: 'maxlength', arguments: 100 }],
    dependent: {
      field: 'likelyToMove',
      value: 'yes'
    },
    labelClassName: 'visuallyhidden',
    autocomplete: 'address-line2'
  },
  outcomeTownOrCity: {
    className: ['govuk-input', 'govuk-!-width-two-thirds'],
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }],
    dependent: {
      field: 'likelyToMove',
      value: 'yes'
    },
    autocomplete: 'address-level2'
  },
  outcomePostcode: {
    className: ['govuk-input', 'govuk-input--width-10'],
    validate: ['required', 'postcode'],
    formatter: ['removespaces', 'uppercase'],
    dependent: {
      field: 'likelyToMove',
      value: 'yes'
    },
    autocomplete: 'postal-code'
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
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 200 }],
    autocomplete: 'name'
  },
  helpRelationship: {
    validate: ['required', 'notUrl', { type: 'maxlength', arguments: 100 }]
  },
  helpContactTypes: {
    mixin: 'checkbox-group',
    options: [
      {
        value: 'email',
        toggle: 'helpEmail',
        child: 'partials/details-summary-input-text-checkboxes'
      },
      {
        value: 'phone',
        toggle: 'helpPhone',
        child: 'partials/details-summary-input-text-checkboxes'
      }
    ],
    validate: 'required'
  },
  helpEmail: {
    validate: ['required', 'email'],
    dependent: {
      field: 'helpContactTypes',
      value: 'email'
    },
    autocomplete: 'email'
  },
  helpPhone: {
    className: ['govuk-input', 'govuk-input--width-20'],
    validate: ['required', 'notUrl'],
    dependent: {
      field: 'helpContactTypes',
      value: 'phone'
    },
    autocomplete: 'tel'
  }
};

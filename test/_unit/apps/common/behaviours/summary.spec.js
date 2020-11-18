'use strict';

const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');
const SummaryBehaviour = require('../../../../../apps/common/behaviours/summary');
const mockTranslations = require('./translations/en/default');
const Model = require('hof-model');
const moment = require('moment');

describe('summary behaviour', () => {
  class Base {
  }

  let behaviour;
  let Behaviour;
  let req;
  let res;
  let lastResult;
  let superLocalsStub;
  let translateMock;

  beforeEach(() => {
    req = request();
    res = response();

    translateMock = sinon.stub();
    translateMock.callsFake(itemNames => {
      if (Array.isArray(itemNames)) {
        for (const index in itemNames) {
          const item = _.get(mockTranslations, itemNames[index]);
          if (item) {
            return item;
          }
        }
        return itemNames[0];
      }
      return _.get(mockTranslations, itemNames, itemNames);
    });
    req.translate = translateMock;

    superLocalsStub = sinon.stub();
    superLocalsStub.returns({ superlocals: 'superlocals' });
    Base.prototype.locals = superLocalsStub;

    req.sessionModel = new Model({});

    req.form.options = {
      fieldsConfig: {
        'hasOtherNames': { mixin: 'radio-group' }
      },
      sections: {
        'pdf-applicant-details': [
          'brpNumber',
          {
            field: 'dateOfBirth',
            parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT)
          }
        ],
        'has-other-names': [
          {
            step: 'has-other-names',
            field: 'hasOtherNames',
            omitFromPdf: true
          },
        ],
        'other-names': [
          {
            step: 'other-names',
            field: 'otherNames',
            dependsOn: 'hasOtherNames',
            addElementSeparators: true
          },
        ]
      },
      steps: {}
    };

    // applicant details
    req.sessionModel.set('brpNumber', '12345678');
    req.sessionModel.set('dateOfBirth', '1980-01-01');
    // other names radio button
    req.sessionModel.set('hasOtherNames', 'yes');
    // other names values
    req.sessionModel.set('otherNames', [
      { itemTitle: 'Jane', fields: [{ field: 'firstName', value: 'Jane' }, { field: 'surname', value: 'Smith' }] },
      { itemTitle: 'Steve', fields: [{ field: 'firstName', value: 'Steve' }, { field: 'surname', value: 'Adams' }] }
    ]);


    Behaviour = SummaryBehaviour(Base);
    behaviour = new Behaviour(req.form.options);

    lastResult = behaviour.locals(req, res);
  });

  it('should trigger parser functions provided in sections.js', () => {
    lastResult.rows.should.containSubset([
      {
        'section': 'Applicant’s details',
        'fields': [
          {
            'label': 'Biometric residence permit (BRP) number',
            'value': '12345678',
            'field': 'brpNumber'
          },
          {
            'label': 'Date of Birth',
            'value': '1st January 1980',
            'field': 'dateOfBirth'
          }
        ]
      }
    ]);
  });

  it('should translate the value for a radio button group', () => {
    lastResult.rows.should.containSubset([{ 'fields': [{ 'value': 'Yes' }] }]);
  });

  it('should output the correct value for a yes/no radio button group', () => {
    lastResult.rows.should.containSubset(
      [{
        'fields': [
          {
            'addElementSeparators': undefined,
            'field': 'hasOtherNames',
            'label': 'Have you been known by any other names?',
            'omitFromPdf': true,
            'parsed': undefined,
            'step': 'has-other-names',
            'value': 'Yes',
          }
        ],
        'section': 'Have you been known by any other names?'
      }]
    );
  });

  it('expands aggregated fields into individual entries for summary display', () => {
    lastResult.rows.should.containSubset(
      [{
        'section': 'Does the applicant have other names?',
        'fields': [
          {
            'label': 'First name',
            'value': 'Jane',
            'changeLink': '/other-names/edit/0/firstName'
          },
          {
            'label': 'Surname',
            'value': 'Smith',
            'changeLink': '/other-names/edit/0/surname'
          },
          {
            'label': 'First name',
            'value': 'Steve',
            'changeLink': '/other-names/edit/1/firstName'
          }
        ]
      }]
    );
  });

  it('should add separators when specified', () => {
    lastResult.rows.should.containSubset([
      {
        'fields': [
          {
            'label': '',
            'value': 'separator',
            'changeLink': '',
            'isSeparator': true
          }
        ]
      }
    ]);
  });
});

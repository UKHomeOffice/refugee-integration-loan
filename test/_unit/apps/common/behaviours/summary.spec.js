const request = require('../../../../helpers/request');
const response = require('../../../../helpers/response');
const SummaryBehaviour = require('../../../../../apps/common/behaviours/summary');
const mockTranslations = require('./translations/en/default');
const Model = require('hof-model');

describe('aggregator behaviour', () => {
  class Base {
  }

  let behaviour;
  let Behaviour;
  let req;
  let res;
  let next;
  let lastResult;
  let superLocalsStub;
  let translateMock;

  beforeEach(() => {
    req = request();
    res = response();

    translateMock = sinon.stub();
    translateMock.callsFake(itemName => _.get(mockTranslations, 'pages.has-other-names.header', itemName));
    req.translate = translateMock;

    superLocalsStub = sinon.stub();
    superLocalsStub.returns({ superlocals: 'superlocals' });
    Base.prototype.locals = superLocalsStub;

    req.sessionModel = new Model({});
    req.sessionModel.set('hasOtherNames', 'yes');

    req.form.options = {
      fieldsConfig: {
        'hasOtherNames': {
        }
      },
      sections: {
        'has-other-names': [
          {
            step: '/has-other-names',
            field: 'hasOtherNames',
            omitFromPdf: true
          },
        ],
      },
      steps: {
        'fields': [
          'hasOtherNames'
        ],
        'next': '/home-office-reference',
        'forks': [
          {
            'target': '/other-names',
            'condition': {
              'field': 'hasOtherNames',
              'value': 'yes'
            }
          }
        ],
        'continueOnEdit': true,
        'behaviours': [
          null,
          null
        ]
      }
    };


    Behaviour = SummaryBehaviour(Base);
    behaviour = new Behaviour(req.form.options);


    lastResult = behaviour.locals(req, res);
  });

  it('should work', () => {
    console.log(lastResult);
    const temp = mockTranslations;
    last.result.rows();
  });
});

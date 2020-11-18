let request = require('../../../../helpers/request');
let response = require('../../../../helpers/response');
let SummaryBehaviour = require('../../../../../apps/common/behaviours/summary');
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


  beforeEach(() => {
    req = request();
    res = response();

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

    last.result.rows()
  });
});


const AggregatorBehaviour = require('../../../../../apps/common/behaviours/aggregator');
const Model = require('hof').model;
const moment = require('moment');


describe('aggregator behaviour', () => {
  class Base {
  }

  let behaviour;
  let Behaviour;
  let req;
  let res;
  let next;

  describe('aggregator', () => {
    let superGetValuesStub;
    let superLocalsStub;

    beforeEach(() => {
      req = request();
      res = response();

      req.sessionModel = new Model({});
      req.form.options = {
        aggregateFrom: ['otherName'],
        aggregateTo: 'otherNames',
        addStep: 'add-other-name',
        route: '/other-names',
        fieldsConfig: {
          firstName: {},
          surname: {}
        }
      };
      req.baseUrl = '/test';

      superGetValuesStub = sinon.stub();
      superLocalsStub = sinon.stub();
      Base.prototype.getValues = superGetValuesStub;
      Base.prototype.locals = superLocalsStub;
      next = sinon.stub();

      Behaviour = AggregatorBehaviour(Base);
      behaviour = new Behaviour(req.form.options);
      behaviour.confirmStep = '/confirm';
    });

    describe('#getValues actions', () => {
      beforeEach(() => {
        behaviour.handleAction = sinon.stub();
      });

      it('sends the delete action when url action is delete', () => {
        req.params.action = 'delete';
        behaviour.getValues(req, res, next);

        behaviour.handleAction.should.be.calledOnceWithExactly(req, res, next, 'delete');
      });

      it('sends the edit action when url action is edit', () => {
        req.params.action = 'edit';
        behaviour.getValues(req, res, next);

        behaviour.handleAction.should.be.calledOnceWithExactly(req, res, next, 'edit');
      });

      it('sends the addItem action when url action is missing, but new fields to add are present, ' +
        'and no elements exist', () => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];

        req.sessionModel.set('firstName', 'Sam');
        req.sessionModel.set('surname', 'Baker');

        behaviour.getValues(req, res, next);

        behaviour.handleAction.should.be.calledOnceWithExactly(req, res, next, 'addItem');
      });

      it('sends the addItem action when url action is missing, but new fields to add are present, ' +
        'and elements already exist', () => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];

        req.sessionModel.set('otherNames', [{ itemTitle: 'John', fields: {} }]);


        req.sessionModel.set('firstName', 'Sam');
        req.sessionModel.set('surname', 'Baker');

        behaviour.getValues(req, res, next);

        behaviour.handleAction.should.be.calledOnceWithExactly(req, res, next, 'addItem');
      });

      it('sends the redirectToAddStep action when url action is not present, no new fields to add are present, ' +
        'and no elements have been added', () => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];
        behaviour.getValues(req, res, next);

        behaviour.handleAction.should.be.calledOnceWithExactly(req, res, next, 'redirectToAddStep');
      });
    });

    describe('#handleAction', () => {
      beforeEach(() => {
        behaviour.deleteItem = sinon.stub();
        behaviour.editItem = sinon.stub();
        behaviour.addItem = sinon.stub();
        behaviour.redirectToAddStep = sinon.stub();
      });

      it('calls deleteItem when the action is delete', () => {
        behaviour.handleAction(req, res, next, 'delete').redirected.should.be.true;
        behaviour.deleteItem.should.be.calledOnceWithExactly(req, res);
      });

      it('calls editItem when the action is edit', () => {
        behaviour.handleAction(req, res, next, 'edit').redirected.should.be.true;
        behaviour.editItem.should.be.calledOnceWithExactly(req, res);
      });

      it('calls addItem when the action is addItem', () => {
        behaviour.handleAction(req, res, next, 'addItem').redirected.should.be.true;
        behaviour.addItem.should.be.calledOnceWithExactly(req, res);
      });

      it('calls redirectToAddStep when the action is redirectToAddStep', () => {
        behaviour.handleAction(req, res, next, 'redirectToAddStep').redirected.should.be.true;
        behaviour.redirectToAddStep.should.be.calledOnceWithExactly(req, res);
      });

      it('calls super.getValues when the action is showItems', () => {
        behaviour.handleAction(req, res, next, 'showItemsshowItems').redirected.should.be.false;
        superGetValuesStub.should.be.calledOnceWithExactly(req, res, next);
      });

      it('calls super.getValues as a default', () => {
        behaviour.handleAction(req, res, next, '');
        superGetValuesStub.should.be.calledOnceWithExactly(req, res, next);
      });
    });

    describe('delete item', () => {
      beforeEach(() => {
        req.sessionModel.set('otherNames', {
          aggregatedValues: [
            { itemTitle: 'John', fields: { value: 'John' } },
            { itemTitle: 'Steve', fields: { value: 'Steve' } },
            { itemTitle: 'Jane', fields: { value: 'Jane' } }
          ]
        });
        req.params.id = '1';
      });

      it('deletes the item with the given id when the action is delete and an id is provide', () => {
        behaviour.deleteItem(req, res);
        req.sessionModel.get('otherNames').aggregatedValues.should.eql([
          { itemTitle: 'John', fields: { value: 'John' } },
          { itemTitle: 'Jane', fields: { value: 'Jane' } }
        ]);
      });

      it('redirects back to step after deletion', () => {
        behaviour.deleteItem(req, res);
        res.redirect.should.be.calledOnceWithExactly('/test/other-names');
      });
    });

    describe('edit item', () => {
      beforeEach(() => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];

        req.sessionModel.set('otherNames', {
          aggregatedValues: [
            {
              itemTitle: 'John',
              fields: [{ field: 'firstName', value: 'John' }, { field: 'surname', value: 'Smith' }]
            },
            {
              itemTitle: 'Steve',
              fields: [{ field: 'firstName', value: 'Steve' }, { field: 'surname', value: 'Adams' }]
            },
            { itemTitle: 'Jane', fields: [{ field: 'firstName', value: 'Jane' }, { field: 'surname', value: 'Doe' }] }
          ]
        });
        req.params.id = '1';

        behaviour.editItem(req, res);
      });

      it('populates the source form fields when the action is edit and an id is provided', () => {
        req.sessionModel.get('firstName').should.eql('Steve');
        req.sessionModel.get('surname').should.eql('Adams');
      });

      it('redirects to the source form', () => {
        res.redirect.should.be.calledOnceWithExactly('/test/add-other-name/edit');
      });
    });

    describe('update item', () => {
      beforeEach(() => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];
        req.form.options.titleField = 'firstName';

        req.sessionModel.set('otherNames', {
          aggregatedValues:
            [
              {
                itemTitle: 'John',
                fields: [{ field: 'firstName', value: 'John' }, { field: 'surname', value: 'Smith' }]
              },
              {
                itemTitle: 'Steve',
                fields: [{ field: 'firstName', value: 'Steve' }, { field: 'surname', value: 'Adams' }]
              },
              { itemTitle: 'Jane', fields: [{ field: 'firstName', value: 'Jane' }, { field: 'surname', value: 'Doe' }] }
            ]
        });
        req.sessionModel.set('otherNames-itemToReplaceId', 1);

        req.sessionModel.set('firstName', 'Sam');
        req.sessionModel.set('surname', 'Baker');

        behaviour.updateItem(req, res);
      });

      it('unsets field used to indicate an update operation', () => {
        expect(req.sessionModel.get('otherNames-itemToReplaceId')).to.be.undefined;
        expect(req.sessionModel.get('firstName')).to.be.undefined;
        expect(req.sessionModel.get('surname')).to.be.undefined;
      });

      it('replaces an item with the source step fields when itemToReplaceId is present ' +
        'in the session and action is edit', () => {
        const updatedElement = req.sessionModel.get('otherNames').aggregatedValues[1];

        updatedElement.should.be.eql({
          itemTitle: 'Sam',
          fields: [
            { field: 'firstName', value: 'Sam', parsed: 'Sam'},
            { field: 'surname', value: 'Baker', parsed: 'Baker' }
          ]
        });
      });

      it('should return to the confirm step if user comes from summary', () => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];
        req.form.options.titleField = 'firstName';

        req.sessionModel.set('otherNames', {
          aggregatedValues: [
            {
              itemTitle: 'John',
              fields: [{ field: 'firstName', value: 'John' }, { field: 'surname', value: 'Smith' }]
            },
            {
              itemTitle: 'Steve',
              fields: [{ field: 'firstName', value: 'Steve' }, { field: 'surname', value: 'Adams' }]
            }
          ]
        });
        req.params.action = 'edit';
        req.sessionModel.set('otherNames-itemToReplaceId', 1);
        req.sessionModel.set('firstName', 'Sam');
        req.sessionModel.set('surname', 'Baker');
        req.sessionModel.set('returnToSummary', true);

        behaviour.getValues(req, res, next);

        res.redirect.should.be.calledWithExactly('/test/confirm');
      });
    });

    describe('add item', () => {
      beforeEach(() => {
        req.form.options.aggregateFrom = ['firstName', 'surname'];
        req.form.options.titleField = 'firstName';

        req.sessionModel.set('firstName', 'Sam');
        req.sessionModel.set('surname', 'Baker');

        req.sessionModel.set('otherNames', {
          aggregatedValues: [
            {
              itemTitle: 'John',
              fields: [{ field: 'firstName', value: 'John' }, { field: 'surname', value: 'Smith' }]
            },
            {
              itemTitle: 'Steve',
              fields: [{ field: 'firstName', value: 'Steve' }, { field: 'surname', value: 'Adams' }]
            },
            { itemTitle: 'Jane', fields: [{ field: 'firstName', value: 'Jane' }, { field: 'surname', value: 'Doe' }] }
          ]
        });

        behaviour.addItem(req, res, next);
      });

      it('adds a new item', () => {
        const addedElement = req.sessionModel.get('otherNames').aggregatedValues[3];

        addedElement.should.be.eql({
          itemTitle: 'Sam',
          fields: [
            { field: 'firstName', value: 'Sam', changeField: undefined, parsed: 'Sam', showInSummary: false },
            { field: 'surname', value: 'Baker', changeField: undefined, parsed: 'Baker', showInSummary: true }
          ]
        });
      });
    });

    describe('#locals', () => {
      let result;
      beforeEach(() => {
        req.form.options.aggregateFrom = ['otherNames'];

        req.sessionModel.set('otherNames', {
          aggregatedValues: [
            {
              itemTitle: 'John Doe',
              fields: [
                {
                  field: 'otherName',
                  value: 'John Doe',
                  showInSummary: false
                }
              ]
            }
          ]
        });

        result = behaviour.locals(req, res);
      });

      it('should call super', () => {
        superLocalsStub.should.be.calledWithExactly(req, res);
      });

      it('should populate the correct items', () => {
        result.should.containSubset({
          items: [
            {
              itemTitle: 'John Doe',
              fields: [
                {
                  field: 'otherName',
                  value: 'John Doe',
                  showInSummary: false
                }
              ],
              index: 0
            }
          ],
          hasItems: true,
          addStep: 'add-other-name',
          field: 'otherNames'
        });
      });
    });

    describe('#parseField', () => {
      it('it should run the field parser', () => {
        req.form.options.aggregateTo = 'dependants';
        req.sessionModel = new Model({});

        req.form.options.fieldsConfig =
          { dependantDateOfBirth: { parse: d => d && moment(d).format(config.PRETTY_DATE_FORMAT) } };

        const value = 1994 - 12 - 12;

        const field = {
          field: 'dependantDateOfBirth',
          changeField: 'dependantDateOfBirth-day'
        };

        const result = behaviour.parseField(field, value, req);

        result.should.eql('1st January 1970');
      });
    });
  });
});

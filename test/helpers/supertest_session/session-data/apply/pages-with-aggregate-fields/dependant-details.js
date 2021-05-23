
module.exports = {
  dependants: {
    aggregatedValues: [
      {
        itemTitle: 'Bob',
        fields: [
          {
            field: 'dependantFullName',
            value: 'Bob',
            showInSummary: false
          },
          {
            field: 'dependantDateOfBirth',
            value: '2005-12-12',
            showInSummary: true,
            changeField: 'dependantDateOfBirth-day',
            parsed: '12th December 2005'
          },
          {
            field: 'dependantRelationship',
            value: 'Son',
            showInSummary: true
          }
        ],
        index: 0
      },
      {
        itemTitle: 'Alice',
        fields: [
          {
            field: 'dependantFullName',
            value: 'Alice',
            showInSummary: false
          },
          {
            field: 'dependantDateOfBirth',
            value: '2006-08-15',
            showInSummary: true,
            changeField: 'dependantDateOfBirth-day',
            parsed: '15th August 2006'
          },
          {
            field: 'dependantRelationship',
            value: 'Daughter',
            showInSummary: true
          }
        ],
        index: 1
      }
    ]
  }
};

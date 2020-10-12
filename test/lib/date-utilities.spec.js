'use strict';

const DateUtilities = require('../../lib/date-utilities');

describe('DateUtilities', () => {
   it('Should return seconds between start and end date', () => {
      const startDate = new Date('October 11, 2020 00:00:00');
      const endDate = new Date('October 12, 2020 00:00:00');
      assert.equal(DateUtilities.secondsBetween(startDate, endDate), 86400);
   });
});

'use strict';

const utilities = require('../../../lib/utilities');

describe('Utilities', () => {
   it('Should return seconds between start and end date', () => {
      const startDate = new Date('October 11, 2020 00:00:00');
      const endDate = new Date('October 12, 2020 00:00:00');
      assert.equal(utilities.secondsBetween(startDate, endDate), 86400);
   });
});

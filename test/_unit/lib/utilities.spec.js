
let utilities = require('../../../lib/utilities');

describe('Utilities', () => {
  describe('#NotifyClient', () => {
    let notify;

    beforeEach(() => {
      utilities = proxyquire('../lib/utilities', {
        '../config': {
          govukNotify: { notifyApiKey: 'USE_MOCK' }
        }
      });
    });

    it('should return a mock instance if Notify key set to USE_MOCK', () => {
      notify = new utilities.NotifyClient();
      expect(notify.constructor.name).to.eql('NotifyMock');
    });

    it('should return a real Notify instance if Notify key not set to USE_MOCK', () => {
      utilities = proxyquire('../lib/utilities', {
        '../config': {
          govukNotify: { notifyApiKey: '123456' }
        }
      });
      notify = new utilities.NotifyClient();
      expect(notify.constructor.name).to.eql('NotifyClient');
    });
  });

  describe('#secondsBetween', () => {
    it('should return seconds between start and end date', () => {
      const startDate = new Date('October 11, 2020 00:00:00');
      const endDate = new Date('October 12, 2020 00:00:00');
      assert.equal(utilities.secondsBetween(startDate, endDate), 86400);
    });
  });

  describe('#capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      assert.equal(utilities.capitalize('hunky-dory'), 'Hunky-dory');
    });
  });
});

'use strict';

const request = require('supertest');

describe('Static Routes', () => {
  let app;

  before(() => {
    app = require('../../../server').server;
  });

  it('should mount the cookies page on the app', done => {
    request(app)
      .get('/cookies')
      .expect(200)
      .end(done);
  });

  it('should mount the terms and conditions page on the app', done => {
    request(app)
      .get('/terms-and-conditions')
      .expect(200)
      .end(done);
  });

});

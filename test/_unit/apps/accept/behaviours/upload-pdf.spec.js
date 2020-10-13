/* eslint-disable no-unused-expressions */
'use strict';

const Behaviour = require('../../../../../apps/accept/behaviours/upload-pdf.js');

describe('Accept Upload PDF Behaviour', () => {
  it('exports a function', () => {
    expect(Behaviour).to.be.a('function');
  });

  describe('initialisation', () => {
    it('returns a mixin', () => {
      class Base {}
      const Mixed = Behaviour(Base);
      expect(new Mixed()).to.be.an.instanceOf(Base);
    });
  });
});

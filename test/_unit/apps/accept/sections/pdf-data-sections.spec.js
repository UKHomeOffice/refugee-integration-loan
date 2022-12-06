
const sections = require('../../../../../apps/accept/sections/summary-data-sections');
const pages = require('../../../../../apps/accept/translations/src/en/pages.json');
const fields = require('../../../../../apps/accept/fields/index');
const utilities = require('../../../../helpers/utilities');

const mappedSections = utilities.mapSections(sections);
const areOrderedEqual = utilities.areOrderedEqual;

describe('Accept PDF Data Sections', () => {
  describe('Sections and Pages', () => {
    it('should have sections and page translations that correlate', () => {
      const sectionsKeys = Object.keys(sections).sort();
      const pagesSectionsKeys = Object.keys(pages.confirm.sections).sort();

      expect(_.isEqual(sectionsKeys, pagesSectionsKeys)).to.be.true;
    });
  });

  describe('Sections and Fields', () => {
    it('pdf-applicant-details', () => {
      const sectionFields = mappedSections['pdf-applicant-details'];
      const expectedFields = [
        'loanReference',
        'name',
        'dateOfBirth'
      ];

      const result = areOrderedEqual(sectionFields, expectedFields);
      expect(result).to.be.true;
    });
  });

  describe('Sections and Fields', () => {
    it('pdf-applicant-details', () => {
      mappedSections['pdf-applicant-details'].every(i => {
        const item = i.field || i;
        return Object.keys(fields).includes(item);
      });
    });
  });
});

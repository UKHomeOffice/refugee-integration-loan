'use strict';
/* eslint-disable no-console */
const puppeteer = require('puppeteer');
const logger = require('../../../../lib/logger');

module.exports = {
  generate: async (html, destination, tempName, application) => {
    try {
      const file = `${destination}/${tempName}`;

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--export-tagged-pdf']
      });
      const page = await browser.newPage();

      // pass in our template
      await page.setContent(html, {
        waitUntil: 'networkidle0'
      });

      await page.emulateMedia('screen');
      await page.pdf({
        path: file,
        format: 'A4',
        printBackground: true
      });

      await browser.close();
      logger.info(`ril.form.${application}.submit_form.save_pdf.successful with uuid: ${tempName}`);
      return file;
    } catch (err) {
      logger.error(`ril.form.${application}.submit_form.save_pdf.error with uuid: ${tempName}`,
          {errorMessage: err.message});
      return Promise.reject(err);
    }
  }
};

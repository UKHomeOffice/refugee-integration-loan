'use strict';
/* eslint-disable no-console */
const puppeteer = require('puppeteer');
const { stubTrue } = require('lodash');

module.exports = {
  generate: async(html, destination, tempName) => {
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

      console.log('>>>>>>>>>>> pdf generated');
      await browser.close();
      return file;
    } catch (e) {
      return Promise.reject(e);
    }
  }
};

'use strict';
/* eslint-disable no-console */
const puppeteer = require('puppeteer');

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

      await browser.close();
      console.log('ril.form.apply.submit_form.save_pdf.successful');
      return file;
    } catch (e) {
      console.log('ril.form.apply.submit_form.save_pdf.error', e);
      return Promise.reject(e);
    }
  }
};

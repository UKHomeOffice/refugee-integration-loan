'use strict';
/* eslint-disable no-console */
const puppeteer = require('puppeteer');

module.exports = {
  generate: async(req, html, destination, tempName, application) => {
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

      await page.emulateMediaType('screen');
      await page.pdf({
        path: file,
        format: 'A4',
        printBackground: true
      });

      await browser.close();
      req.log('info', `ril.form.${application}.submit_form.save_pdf.successful with uuid: ${tempName}`);
      return file;
    } catch (err) {
      req.log('error', `ril.form.${application}.submit_form.save_pdf.error with uuid: ${tempName}`, err.message || err);
      throw err;
    }
  }
};

'use strict';
/* eslint-disable no-console */
const fs = require('fs');
const puppeteer = require('puppeteer');
const hogan = require('hogan.js');

module.exports = {
  generate: async(html, destination, tempName) => {
    try {
      const file = `${destination}/${tempName}`;

      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
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
      console.log('>>>>>>>>>our error', e);
    }
  }
};

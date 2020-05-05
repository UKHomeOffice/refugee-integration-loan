'use strict';

const url = require('url');
const Model = require('hof-model');
const config = require('../../../config');
const debug = require('debug')('upload-model');

module.exports = class UploadModel extends Model {

  save() {
    return new Promise((resolve, reject) => {
      const attributes = {
        url: config.upload.hostname
      };
      const reqConf = url.parse(this.url(attributes));
      reqConf.formData = {
        document: {
          value: this.get('data'),
          options: {
            filename: this.get('name'),
            contentType: this.get('mimetype')
          }
        }
      };
      reqConf.method = 'POST';
      debug('SAVE PDF DATA', reqConf);
      this.request(reqConf, (err, data) => {
        if (err) {
          return reject(err);
        }
        debug('RESPONSE FROM FILE VAULT SAVE', err, data);
        resolve(data);
      });
    });
  }

  auth() {
    if (!config.keycloak.tokenUrl) {
      // eslint-disable-next-line no-console
      console.error('keycloak token url is not defined');
      return Promise.resolve({
        bearer: 'abc123'
      });
    }
    const tokenReq = {
      url: config.keycloak.tokenUrl,
      form: {
        username: config.keycloak.username,
        password: config.keycloak.password,
        'grant_type': 'password',
        'client_id': config.keycloak.clientId,
        'client_secret': config.keycloak.clientSecret
      },
      method: 'POST'
    };

    return new Promise((resolve, reject) => {
      debug('REQUEST DATA', tokenReq);
      this._request(tokenReq, (err, res) => {
        debug('RESPONSE FROM FILE VAULT', err, res);
        if (err) {
          return reject(err);
        }
        resolve({
          'bearer': JSON.parse(res.body).access_token
        });
      });
    });
  }
};

/**
 * Model for vCard
 */
'use strict';

const fs = require('fs'),
  vcf = require('vcf');

const testData = 'BEGIN:VCARD\n' +
  'VERSION:2.1\n' +
  'N:Gerdes;Uwe;;;\n' +
  'FN:Uwe Gerdes\n' +
  'TEL;WORK;VOICE:040/23519934\n' +
  'TEL;CELL:0151 42537945\n' +
  'EMAIL;PREF:uwe@uwegerdes.de\n' +
  'URL:http://www.uwegerdes.de/\n' +
  'END:VCARD';

class Vcard {
  /**
   * build a vcard
   */
  constructor(vcard) {
    this.vcard = vcard;
  }

  /**
   * get the field names
   */
  getFields() {
    return Object.keys(this.vcard.data);
  }

  /**
   * get the field names
   */
  getValue(key) {
    let value = this.vcard.get(key).valueOf();
    if (typeof value == 'string') {
      return value;
    } else {
      let result = [];
      value.forEach((entry) => { // jscs:ignore jsDoc
        result.push({
          type: entry.type,
          value: entry.valueOf()
        });
      });
      return result;
    }
  }
}

module.exports = {
  Vcard: Vcard,
  /**
   * get static list
   */
  get: () => {
    return [
      {
        _version: '2.1',
        name: 'Gerdes',
        firstname: 'Uwe'
      }
    ];
  },
  /**
   * get testData list
   */
  getTestData: () => {
    const data = vcf.parse(testData);
    return data;
  },
  /**
   * read testData file
   *
   * @param {string} filename - file to open
   */
  open: (filename) => {
    return new Promise(function (resolve, reject) {
      try {
        fs.readFile(filename, 'utf8', function (err, buffer) {
          if (err) {
            reject(err);
          } else {
            const data = vcf.parse(buffer);
            resolve(data);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }
};

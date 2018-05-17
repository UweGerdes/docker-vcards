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

let data,
  list = []
  ;

class Vcard {
  /**
   * build a vcard
   */
  constructor(vcard, id) {
    this.vcard = vcard;
    this.id = id;
  }

  /**
   * get the field names
   */
  getFields() {
    return Object.keys(this.vcard.data);
  }

  /**
   * get the field value
   */
  getValue(key) {
    if (this.vcard.get(key)) {
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
    } else {
      return null;
    }
  }

  /**
   * get the field type
   */
  getType(key) {
    let value = this.vcard.get(key).type;
    return value;
  }

  /**
   * get the field type
   */
  matches(selection) {
    if (selection && selection.searchString && selection.searchString.length > 0) {
      let hit = false;
      let searchFields = selection.searchFields || ['fn'];
      if (typeof searchFields == 'string') {
        searchFields = [searchFields];
      }
      searchFields.forEach((field) => { // jscs:ignore jsDoc
        hit = hit || this.getValue(field) &&
          this.getValue(field).indexOf(selection.searchString) >= 0;
      });
      return hit;
    }
    return true;
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
            data = vcf.parse(buffer);
            data.forEach((item, id) => { // jscs:ignore jsDoc
              list.push(new Vcard(item, id));
            });
            resolve(data);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  /**
   * get list of Vcard objects
   *
   * @param {object} selection - to reduce list, optional
   */
  list: (selection) => {
    let result = [];
    list.forEach((item) => { // jscs:ignore jsDoc
      if (item.matches(selection)) {
        result.push(item);
      }
    });
    return result;
  }
};

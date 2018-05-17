/**
 * Model for vCard
 * @module modules/vcards/model
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
   *
   * @param {object} vcard - vcf object
   * @param {int} id - item id
   */
  constructor(vcard, id) {
    this.vcard = vcard;
    this.id = id;
  }

  /**
   * get the field names
   *
   * @returns {array} - array with field names
   */
  getFields() {
    return Object.keys(this.vcard.data);
  }

  /**
   * get the field value
   *
   * @param {string} field - name of field
   * @returns {string} - value
   */
  getValue(field) {
    if (this.vcard.get(field)) {
      let value = this.vcard.get(field).valueOf();
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
   *
   * @param {string} field - name of field
   * @returns {array} - type list
   */
  getType(field) {
    let value = this.vcard.get(field).type;
    return value;
  }

  /**
   * check if vcard matches this selection
   *
   * @param {object} selection - searchFields and searchString
   * @returns {boolean} - match result
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
   *
   * @returns {array} vcard item
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
   *
   * @returns {array} vcard list
   */
  getTestData: () => {
    const data = vcf.parse(testData);
    return data;
  },
  /**
   * read vcf file
   *
   * @param {string} filename - file to open
   * @returns {Promise} data if resolved, err if rejected
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
   * get list of vcard objects
   *
   * @param {object} selection - to reduce list, optional
   * @returns {array} vcard list
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

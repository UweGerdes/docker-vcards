/**
 * ## Model for vCard
 *
 * @module vcards/model
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

const fields = {
  version: {
    label: 'Version',
    type: 'text',
    size: 5
  },
  n: {
    label: 'Name',
    type: 'text',
    size: 30
  },
  fn: {
    label: 'Anzeigename',
    type: 'text',
    size: 30
  },
  tel: {
    label: 'Telefon',
    type: 'list',
    size: 30,
    types: ['work', 'home', 'voice', 'cell', 'pref']
  },
  adr: {
    label: 'Adresse',
    type: 'list',
    size: 30,
    types: ['work', 'home', 'pref']
  },
  email: {
    label: 'E-Mail',
    type: 'list',
    size: 30,
    types: ['work', 'home', 'pref', 'internet']
  },
  url: {
    label: 'Homepage',
    type: 'text',
    size: 30,
    types: ['work', 'home', 'pref', 'internet']
  },
  rev: {
    label: 'Timestamp',
    type: 'text',
    size: 30
  }
};

const types = {
  voice: 'Sprache',
  cell: 'Mobil',
  work: 'Arbeit',
  home: 'privat',
  pref: '!',
  internet: 'Web'
};

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
    list = [];
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
    if (selection) {
      list.forEach((item) => { // jscs:ignore jsDoc
        if (item.matches(selection)) {
          result.push(item);
        }
      });
    } else {
      result = list;
    }
    return result;
  },
  /**
   * save vcard object
   *
   * @param {int} index - item id to save
   * @param {object} data - map with data
   */
  save: (index, data) => {
    const vcard = data2vcard(data);
    vcard.version = data.version;
    if (index < list.length) {
      list[index].vcard = vcard;
    } else {
      list.push(new Vcard(vcard, list.length));
    }
    return list[index].vcard;
  },
  /**
   * save vcard object
   *
   * @param {int} index - item id to save
   * @param {object} data - map with data
   */
  del: (index) => {
    if (index < list.length) {
      list.splice(index, 1);
    }
  },
  /**
   * export meta data
   */
  fields: fields,
  types: types
};

/**
 * make vcard object from jcard
 *
 * @param {object} data - data for new vcard
 */
const data2vcard = (data) => {
  const keyList = Object.keys(fields);
  const dataJSON = [];
  Object.keys(data).forEach((name) => { // jscs:ignore jsDoc
    const matches = name.match(/^(.+?)([0-9]*)?$/);
    const field = matches[1];
    if (keyList.indexOf(field) >= 0) {
      let typeJSON = {};
      if (data[name + '_type']) {
        typeJSON = { type: data[name + '_type'] };
      }
      dataJSON.push([field, typeJSON, 'text', data[name]]);
    }
  });
  return vcf.fromJSON(['vcard', dataJSON]);
};

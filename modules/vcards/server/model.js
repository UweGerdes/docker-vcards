/**
 * ## Model for vCard
 *
 * @module vcards/model
 */
'use strict';

const fs = require('fs'),
  glob = require('glob'),
  libqp = require('libqp'),
  path = require('path'),
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
  datasetName,
  list = [],
  lists = { }
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
   * @param {boolean} parts - split parts
   * @returns {string} - value
   */
  getValue(field, parts) {
    if (this.vcard.get(field)) {
      let value = this.vcard.get(field).valueOf();
      if (typeof value == 'string') {
        if (this.vcard.get(field).encoding == 'QUOTED-PRINTABLE') {
          value = libqp.decode(value).toString();
        }
        if (false) {
          console.log('splitParts', splitParts(field, value));
        }
        if (parts) {
          return splitParts(field, value);
        } else {
          return value;
        }
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
   * get the vcard field
   *
   * @param {string} field - name of field
   * @returns {map} - data
   */
  get(field) {
    return this.vcard.get(field);
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
    size: 30,
    parts: ['Nachname', 'Vorname', '?', '?', '?'],
    checkEqual: (n1, n2) => { // jscs:ignore jsDoc
      if (n1 && n2) {
        if (n1.replace(/^;*(.+?);*$/, '$1') == n2.replace(/^;*(.+?);*$/, '$1')) {
          return true;
        }
      } else {
        console.log('n1', n1, 'n2', n2);
      }
      return false;
    }
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
    types: ['work', 'home', 'voice', 'cell', 'pref'],
    clean: cleanTel,
    checkEqual: (tel1, tel2) => { // jscs:ignore jsDoc
      if (tel1 && tel2) {
        if (cleanTel(tel1) == cleanTel(tel2)) {
          return true;
        }
      } else {
        console.log('tel1', tel1, 'tel2', tel2);
      }
      return false;
    }
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
  org: {
    label: 'Firma',
    type: 'text',
    size: 30
  },
  xGroupMembership: {
    label: 'Gruppen',
    type: 'list',
    size: 30
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

/**
 * ### split value parts, add label
 *
 * split on ';', return array or map
 *
 * @private
 * @param {string} field - name
 * @param {string} value - to convert
 * @returns {object} value in parts
 */
function splitParts(field, value) {
  const parts = value.split(/;/);
  if (fields[field] && fields[field].parts) {
    let map = {};
    fields[field].parts.forEach((part, i) => { // jscs:ignore jsDoc
      map[part] = parts[i] || '';
    });
    return map;
  } else {
    return value
      .replace(/^;*(.+?);*$/, '$1')
      .replace(/;+/g, ', ');
  }
}

/**
 * get cleaned phone number for comparison
 *
 * @param {string} tel - phone number
 */
function cleanTel(tel) {
  if (tel.replace) {
    return tel
      .replace(/[ /-]/g, '')
      .replace(/^0/g, '+49');
  } else {
    console.log('cleanTel error', typeof tel, tel);
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
    return openFile(filename);
  },
  /**
   * switch data set
   *
   * @param {string} name - to set as list
   * @returns {Promise} with vcard list
   */
  switchDataset: (name) => {
    if (lists[name]) {
      list = lists[name];
      datasetName = name;
      return new Promise(function (resolve) {
        resolve(name);
      });
    } else {
      if (name == 'testdata') {
        return openFile(path.join(path.dirname(__dirname), 'tests', 'server', name + '.vcf'));
      } else {
        return openFile(path.join(path.dirname(__dirname), 'data', name + '.vcf'));
      }
    }
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
   * list of dataset names
   *
   * @returns {array} with names
   */
  datasetNames: () => {
    return Object.keys(lists);
  },
  /**
   * export meta data
   */
  datasetName: () => {
    return datasetName;
  },
  /**
   * list of data file names
   *
   * @returns {array} with names
   */
  datasetFiles: () => {
    let paths = glob.sync(path.join(path.dirname(__dirname), 'data', '*.vcf'));
    paths.map((p, i, paths) => { // jscs:ignore jsDoc
      paths[i] = path.basename(p, path.extname(p));
    });
    return paths;
  },
  fields: fields,
  types: types
};

/**
 * open file
 *
 * @param {object} filename - to open
 * @returns {Promise} with parsed buffer // TODO buffer not needed?
 */
function openFile(filename) {
  const name = path.basename(filename, path.extname(filename));
  const oldDatasetName = datasetName;
  return new Promise(function (resolve, reject) {
    try {
      fs.readFile(filename, 'utf8', function (err, buffer) {
        if (err) {
          reject(err);
        } else {
          list = [];
          lists[name] = [];
          data = vcf.parse(buffer);
          data.forEach((item, id) => { // jscs:ignore jsDoc
            list.push(new Vcard(item, id));
            lists[name].push(new Vcard(item, id));
          });
          datasetName = name;
          resolve(oldDatasetName);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

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

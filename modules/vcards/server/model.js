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
  Vcf = require('vcf');

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
    if (vcard) {
      this.fields = Object.keys(this.vcard.data);
    }
    this.prop = new Proxy({},
      {
        get: (obj, field) => { // jscs:ignore jsDoc
          let value = this.getValue(field, true);
          let field2 = this.vcard.get(field);
          let type;
          if (field2) {
            type = field2.type;
          }
          if (fields[field].type == 'list') {
            if (!(value instanceof Array)) {
              value = [{ value: value }];
              if (type) {
                value[0].type = type;
              }
            }
          } else if (fields[field].type == 'timestamp') {
            const date = new Date(value);
            value = { value: date.toLocaleString() };
          } else {
            value = { value: value };
            if (type) {
              value.type = type;
            }
            if (field2 && field2.encoding) {
              value.encoding = field2.encoding;
            }
          }
          return value;
        },
        set: (obj, name, data) => { // jscs:ignore jsDoc
          console.log('set', name, data);
          let value = data.value;
          if (fields[name].parts) {
            const v = fields[name].parts.map(part => value[part] || ''); // jscs:ignore jsDoc
            if (v.join('')) {
              value = v.join(';');
            }
          } else if (fields[name].type == 'timestamp') {
            value = new Date(value).toISOString().replace(/\.0+Z/, 'Z');
          }
          const params = data.params;
          if (value) {
            console.log('prepared', name, value, params);
          }
          if (value) {
            if (fields[name].type == 'list' && this.vcard.get(name)) {
              this.vcard.add(name, value, params);
            } else {
              this.vcard.set(name, value, params);
            }
          }
          return true;
        }
      }
    );

    this.text = new Proxy({},
      {
        get: (obj, field) => { // jscs:ignore jsDoc
          return propToString(this.prop[field], field);
        }
      }
    );
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

  /**
   * get JSON
   *
   * @returns {object} - data
   */
  toJSON() {
    return this.vcard.toJSON();
  }

  /**
   * get VCF
   *
   * @returns {string} - data
   */
  toVCF() {
    return this.vcard.toString('4.0');
  }
}

/**
 * propToString
 *
 * @param {object} prop - to convert
 * @param {object} field - name
 * @returns {string} - prop string
 */
function propToString(prop, field) {
  let result;
  if (prop instanceof Array) {
    result = [];
    prop.forEach((p) => { // jscs:ignore jsDoc
      result.push(propToString(p, field));
    });
  } else {
    let value = prop.value;
    if (value instanceof Object) {
      result = value;
    } else {
      let type = '';
      if (prop.type && fields[field]) {
        if (fields[field].type != 'image') {
          type = ' (' + (prop.type instanceof Array ? prop.type.join(', ') : prop.type) + ')';
        }
      }
      result = value + type;
    }
  }
  return result;
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
    parts: ['Nachname', 'Vorname', 'part3', 'Titel', 'part5'],
    parts_order: ['Vorname', 'Nachname', 'Titel', 'part3', 'part5'],
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
    clean: cleanTel
  },
  adr: {
    label: 'Adresse',
    type: 'list',
    size: 30,
    types: ['work', 'home', 'pref'],
    parts: ['part1', 'part2', 'Straße', 'Ort', 'part5', 'PLZ', 'Land'],
    parts_order: ['Straße', 'PLZ', 'Ort', 'Land', 'part1', 'part2', 'part5']
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
  photo: {
    label: 'Foto',
    type: 'image',
    size: 1,
    types: ['jpeg', 'gif', 'png']
  },
  rev: {
    label: 'Timestamp',
    type: 'timestamp',
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
      if (parts[i]) {
        map[part] = parts[i];
      }
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
   * @param {string} id - to open
   * @returns {array} vcard item
   */
  get: (id) => {
    let result = null;
    list.forEach((vcard) => { // jscs:ignore jsDoc
      if (vcard.id == id) {
        result = vcard;
      }
    });
    return result;
  },
  /**
   * get testData list
   *
   * @returns {array} vcard list
   */
  getTestData: () => {
    const data = Vcf.parse(testData);
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
    if (name.indexOf('test') == 0) {
      return openFile(path.join(path.dirname(__dirname), 'tests', 'server', name + '.vcf'));
    } else {
      if (lists[name]) {
        list = lists[name];
        datasetName = name;
        return new Promise(function (resolve) {
          resolve(name);
        });
      } else {
        return openFile(path.join(path.dirname(__dirname), 'data', name + '.vcf'));
      }
    }
  },
  /**
   * get list of vcard objects
   *
   * @param {string} selection - to reduce list, optional
   * @param {string} sort - to sort list
   * @returns {array} vcard list
   */
  list: (selection, sort) => {
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
    if (sort) {
      result.sort(
        function (a, b) {
          if (a.get(sort).valueOf() > b.get(sort).valueOf()) {
            return 1;
          }
          if (a.get(sort).valueOf() < b.get(sort).valueOf()) {
            return -1;
          }
          return 0;
        }
      );
      throw('sort');
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
    const vcard = data2vcard(data, index);
    vcard.version = data.version;
    if (index < list.length) {
      list[index].vcard = vcard;
      list[index].fields = Object.keys(vcard.data);
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
   * vcards to JSON
   *
   * @param {object} data - array with data
   */
  toJSON: () => {
    let result = [];
    list.forEach((item) => { // jscs:ignore jsDoc
      result.push(item.toJSON());
    });
    return result;
  },
  /**
   * vcards to VCF
   *
   * @param {object} data - array with data
   */
  toVCF: () => {
    let result = [];
    list.forEach((item) => { // jscs:ignore jsDoc
      result.push(item.toVCF());
    });
    return result.join('\n') + '\n';
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
          data = Vcf.parse(buffer);
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
 * @param {object} index - in list
 */
const data2vcard = (data, index) => {
  const dataKeys = Object.keys(data);
  let dataJSON = [];
  Object.keys(fields).forEach((name) => { // jscs:ignore jsDoc
    const field = fields[name];
    if (field.type == 'list') {
      const re = new RegExp('^' + name + '([0-9]*)(' +
                            (field.parts ? '_' + field.parts_order[0] : '') + ')?$');
      dataKeys.forEach(key => { // jscs:ignore jsDoc
        const match = re.exec(key);
        if (match) {
          dataJSON.push([name, typeArray(data, name + match[1]), 'text',
                        dataValue(data, name + match[1], field.parts)]);
        }
      });
    } else {
      const value = dataValue(data, name, field.parts);
      if (value) {
        dataJSON.push([name, typeArray(data, name), 'text', value]);
      }
    }
  });
  const vcard1 = Vcf.fromJSON(['vcard', dataJSON]);
  const vcard2 = new Vcard(new Vcf(), index);
  Object.keys(fields).forEach((name) => { // jscs:ignore jsDoc
    const field = fields[name];
    if (field.type == 'list') {
      const re = new RegExp('^' + name + '([0-9]*)(' +
                            (field.parts ? '_' + field.parts_order[0] : '') + ')?$');
      dataKeys.forEach(key => { // jscs:ignore jsDoc
        const match = re.exec(key);
        if (match) {
          const value = dataValue2(data, name + match[1], field.parts);
          if (value) {
            vcard2.prop[name] = { value: value, params: dataParams(data, name + match[1]) };
          }
        }
      });
    } else {
      const value = dataValue2(data, name, field.parts);
      if (value) {
        vcard2.prop[name] = { value: value, params: dataParams(data, name) };
        //console.log(JSON.stringify(data[name]));
      }
    }
  });
  return vcard1;
};

/**
 * get value from form data
 *
 * @param {object} data - data for new vcard
 * @param {string} name - fieldname
 * @param {object} parts - parts for entry
 */
const dataValue2 = (data, name, parts) => {
  let value;
  if (parts) {
    if (data[name] && data[name].indexOf('{') == 0) {
      value = JSON.parse(data[name]);
    } else {
      value = {};
      parts.forEach(part => { // jscs:ignore jsDoc
        if (data[name + '_' + part]) {
          value[part] = data[name + '_' + part] || '';
        }
      });
    }
  } else {
    value = data[name];
  }
  return value;
};

/**
 * get params map from form data
 *
 * @param {object} data - data for new vcard
 * @param {string} name - fieldname
 */
const dataParams = (data, name) => {
  let params = {};
  if (data[name + '_type']) {
    params = { type: data[name + '_type'] };
  }
  return params;
};

/**
 * get value from form data
 *
 * @param {object} data - data for new vcard
 * @param {string} name - fieldname
 * @param {object} parts - parts for entry
 */
const dataValue = (data, name, parts) => {
  let value;
  if (parts) {
    if (data[name] && data[name].indexOf('{') == 0) {
      const map = JSON.parse(data[name]);
      const v = parts.map(part => map[part] || ''); // jscs:ignore jsDoc
      if (v.join('')) {
        value = v;
      }
    } else {
      const v = parts.map(part => data[name + '_' + part] || ''); // jscs:ignore jsDoc
      if (v.join('')) {
        value = v;
      }
    }
  } else {
    value = data[name];
  }
  return value;
};

/**
 * get type array from form data
 *
 * @param {object} data - data for new vcard
 * @param {string} name - fieldname
 */
const typeArray = (data, name) => {
  let typeJSON = {};
  if (data[name + '_type']) {
    typeJSON = { type: data[name + '_type'] };
  }
  return typeJSON;
};

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

const testData = 'BEGIN:VCARD\r\n' +
  'VERSION:2.1\r\n' +
  'N:Gerdes;Uwe;;;\r\n' +
  'FN:Uwe Gerdes\r\n' +
  'TEL;WORK;VOICE:040/23519934\r\n' +
  'TEL;CELL:0151 42537945\r\n' +
  'EMAIL;PREF:uwe@uwegerdes.de\r\n' +
  'URL:http://www.uwegerdes.de/\r\n' +
  'END:VCARD';

let datasetName,
  lists = { },
  selections = { };

const fields = {
  version: {
    label: 'Version',
    type: 'text',
    selection: true,
    size: 5
  },
  n: {
    label: 'Name',
    type: 'text',
    size: 30,
    parts: ['Nachname', 'Vorname', 'VN2', 'Titel', 'Zusatz'],
    parts_order: ['Titel', 'Vorname', 'VN2', 'Nachname', 'Zusatz']
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
  bday: {
    label: 'Geburtstag',
    type: 'date',
    size: 10
  },
  note: {
    label: 'Notiz',
    type: 'text',
    size: 30
  },
  title: {
    label: 'Titel',
    type: 'text',
    size: 30
  },
  xGroupMembership: {
    label: 'Gruppen',
    type: 'list',
    selection: true,
    size: 30
  },
  photo: {
    label: 'Foto',
    type: 'image',
    size: 1,
    types: ['jpeg', 'gif', 'png']
  },
  rev: {
    label: 'Revision',
    type: 'timestamp',
    size: 30,
    default: () => {
      return (new Date()).toLocaleString(
        'de-DE',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Europe/Berlin'
        }
      );
    }
  },
  xStatus: {
    label: 'Status',
    type: 'text',
    size: 30,
    default: (status) => {
      return status || '';
    }
  },
  xTimestamp: {
    label: 'Timestamp',
    type: 'timestamp',
    size: 30,
    default: () => {
      return (new Date()).toLocaleString(
        'de-DE',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Europe/Berlin'
        }
      );
    }
  }
};

/**
 * translation for types
 */
const types = {
  voice: 'Sprache',
  cell: 'Mobil',
  work: 'Arbeit',
  home: 'privat',
  pref: '!',
  internet: 'Web'
};

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
      if (vcard.data) {
        this.fields = Object.keys(this.vcard.data);
      } else {
        console.log('cannot set fields for new vcard:', typeof vcard);
      }
    }
    this.prop = new Proxy(
      {},
      {
        get: (obj, name) => {
          let value = getValue(this.vcard, name);
          let data = this.vcard.get(name);
          let prop;
          if (fields[name].type === 'list') {
            if (!(value instanceof Array)) {
              prop = [{ value: value }];
              if (data && data.type) {
                prop[0].type = data.type;
              }
            } else {
              prop = value;
            }
            if (fields[name].clean) {
              let values = [];
              let propList = [];
              prop.forEach((entry) => {
                const cleanValue = fields[name].clean(entry.value);
                if (values.indexOf(cleanValue) < 0) {
                  values.push(cleanValue);
                  propList.push(entry);
                }
              });
              prop = propList;
            }
          } else if (fields[name].type === 'timestamp') {
            if (value) {
              prop = {
                value: (new Date(value
                  .replace(/(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z/, '$1-$2-$3T$4:$5:$6Z'))).toLocaleString('de-DE', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                  timeZone: 'Europe/Berlin'
                })
              };
              // console.log(value, new Date(value.
              //         replace(/(.{4})(.{2})(.{2})T(.{2})(.{2})(.{2})Z/, '$1-$2-$3T$4:$5:$6Z')
              //       ), prop.value);
            } else {
              prop = { };
            }
          } else if (fields[name].type === 'date') {
            if (value) {
              prop = { value: value.replace(/([0-9]{4})-?([0-9]{2})-?([0-9]{2})/, '$3.$2.$1') };
            } else {
              prop = { };
            }
          } else {
            prop = { value: value };
            if (data) {
              if (data.type) {
                prop.type = data.type;
              }
              if (data.encoding) {
                prop.encoding = data.encoding;
              }
              if (data.charset) {
                prop.charset = data.charset;
              }
            }
          }
          return prop;
        },
        set: (obj, name, data) => {
          // console.log('set', name, data);
          let value = data.value;
          const params = data.params;
          // if (fields[name].type === 'image') {
          //  console.log('set', name, data);
          // }
          if (fields[name].parts) {
            const v = fields[name].parts.map(part => value[part] || '');
            if (v.join('')) {
              if (!/^[\x00-\x7F]*$/.test(v.join(''))) { // eslint-disable-line no-control-regex
                params.encoding = 'QUOTED-PRINTABLE';
                params.charset = 'UTF-8';
                value = v.map(p => encodeQP(p)).join(';');
              } else {
                value = v.join(';');
              }
            }
          } else if (fields[name].type === 'timestamp') {
            value = (new Date(value.replace(/^([0-9]+)\.([0-9]+)\./, '$2.$1.')))
              .toISOString().replace(/\.0+Z/, 'Z').replace(/[:-]/g, '');
          } else if (fields[name].type === 'date') {
            value = value.replace(/([0-9]+)\.([0-9]+)\.([0-9]+)/, '$3-$2-$1');
          } else if (typeof value === 'string' && !/^[\x00-\x7F]*$/.test(value)) { // eslint-disable-line no-control-regex
            params.encoding = 'QUOTED-PRINTABLE';
            params.charset = 'UTF-8';
            value = encodeQP(value);
          }
          // if (fields[name].type === 'image') {
          //  console.log('prepared', name, value, params);
          // }
          if (value) {
            if (fields[name].type === 'list' && this.vcard.get(name)) {
              this.vcard.add(name, value, params);
            } else {
              this.vcard.set(name, value, params);
            }
          }
          if (this.fields.indexOf(name) < 0) {
            this.fields.push(name);
          }
          return true;
        }
      }
    );

    this.text = new Proxy(
      {},
      {
        get: (obj, name) => {
          return propToString(this.prop[name], name);
        }
      }
    );
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
   * check if vcard matches this filter
   *
   * @param {object} filter - searchFields and searchString
   * @returns {boolean} - match result
   */
  matches(filter) {
    if (filter && filter.searchString && filter.searchString.length > 0) {
      let hit = false;
      let searchFields = filter.searchFields || ['fn'];
      if (typeof searchFields === 'string') {
        searchFields = [searchFields];
      }
      searchFields.forEach((field) => {
        hit = hit || this.text[field].indexOf(filter.searchString) >= 0;
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
    if (this.vcard.toString() === '[object Object]') {
      console.log('[object Object]', Object.keys(this.vcard));
    } else {
      let vcardString = this.vcard.toString()
        .replace(/VERSION:.\.0/g, 'VERSION:2.1')
        .replace(/TYPE=([a-z]+),/g, 'TYPE=$1;')
        .replace(/TYPE=([a-z;]+),/g, 'TYPE=$1;')
        .replace(/TYPE=([a-z;]+):/g, function (v) {
          return v.replace(/TYPE=([a-z;]+):/, '$1:').toUpperCase();
        })
        .replace(/TEL.+$/g, function (v) {
          return v.replace(/[^a-zA-Z0-9.;:]/g, '').toUpperCase();
        })
        .replace(/X-STATUS:[^\n]+\n/g, '');
      return vcardString + '\r';
    }
  }
}

/**
 * get the field value
 *
 * @param {Vcard} vcard - to find the field
 * @param {string} name - name of field
 * @returns {string} - value
 */
function getValue(vcard, name) {
  if (vcard.get(name)) {
    let value = vcard.get(name).valueOf();
    let data = vcard.get(name);
    if (typeof value === 'string') {
      if (fields[name] && fields[name].parts) {
        const parts = value.split(/;/);
        let map = {};
        fields[name].parts.forEach((part, i) => {
          if (parts[i]) {
            if (data.encoding && data.encoding === 'QUOTED-PRINTABLE') {
              map[part] = libqp.decode(parts[i]).toString();
            } else {
              map[part] = parts[i];
            }
          }
        });
        return map;
      } else {
        if (data.encoding && data.encoding === 'QUOTED-PRINTABLE') {
          value = libqp.decode(value).toString();
        }
        return value;
      }
    } else {
      let result = [];
      value.forEach((entry) => {
        let prop = {
          value: entry.valueOf()
        };
        if (entry.type) {
          prop.type = entry.type;
        }
        if (entry.charset) {
          prop.charset = entry.charset;
        }
        if (entry.encoding) {
          prop.encoding = entry.encoding;
          if (entry.encoding === 'QUOTED-PRINTABLE') {
            prop.value = libqp.decode(entry.valueOf()).toString();
          }
        }
        result.push(prop);
      });
      return result;
    }
  } else {
    return '';
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
    let list = [];
    prop.forEach((p) => {
      list.push(propToString(p, field));
    });
    result = list.join('\n');
  } else {
    let value = prop.value;
    if (value instanceof Object) {
      result = Object.values(value).join(', ');
    } else {
      let type = '';
      if (prop.type && fields[field]) {
        if (fields[field].type !== 'image') {
          type = ' (' + (prop.type instanceof Array ? prop.type.join(', ') : prop.type) + ')';
        }
      }
      result = value + type;
    }
  }
  return result;
}

/**
 * encodeQP
 *
 * @param {string} value - to convert
 * @returns {string} - quoted printable string
 */
function encodeQP(value) {
  return Array.prototype.map.call(value, x => {
    const c = x.charCodeAt(0);
    if (c <= 127) {
      return '=' + ('0' + (Number(c).toString(16))).slice(-2).toUpperCase();
    } else {
      return libqp.encode(x);
    }
  }).join('');
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
    if (lists[datasetName]) {
      return lists[datasetName][id];
    }
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
   */
  open: openFile,
  /**
   * upload vcf file
   */
  upload: uploadFile,
  /**
   * switch data set
   *
   * @param {string} name - to set as list
   * @returns {Promise} with vcard list
   */
  switchDataset: (name) => {
    if (name.indexOf('test') === 0) {
      return openFile(path.join(path.dirname(__dirname), 'tests', 'data', name + '.vcf'));
    } else {
      name = name.replace(/\.vcf$/, '');
      if (lists[name]) {
        datasetName = name;
        return new Promise(function (resolve) {
          resolve(name);
        });
      } else {
        console.log('loading:', name);
        return openFile(path.join(
          path.dirname(__dirname),
          'data',
          name + '.vcf'
        ));
      }
    }
  },
  /**
   * get list of vcard objects
   */
  list: list,
  /**
   * save vcard object
   *
   * @param {int} index - item id to save
   * @param {object} data - map with data
   * @param {object} files - list with files
   */
  save: (index, data, files) => {
    const vcard = data2vcard(index, data, files);
    vcard.version = data.version;
    lists[datasetName][index] = vcard;
    return lists[datasetName][index].vcard;
  },
  /**
   * save vcard object
   *
   * @param {int} index - item id to save
   * @param {object} data - map with data
   */
  del: (index) => {
    if (lists[datasetName][index]) {
      delete lists[datasetName][index];
    }
  },
  /**
   * vcards to JSON
   *
   * @param {object} data - array with data
   */
  toJSON: () => {
    let result = [];
    Object.values(lists[datasetName]).forEach((item) => {
      result.push(item.toJSON());
    });
    return result;
  },
  /**
   * vcards to VCF
   *
   * @param {string} filter - to reduce list, optional
   * @param {string} sort - to sort list
   * @param {object} data - array with data
   */
  toVCF: (filter, sort) => {
    let result = [];
    list(filter, sort).forEach((item) => {
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
    paths
      .forEach((p, i, paths) => {
        paths[i] = path.basename(p, path.extname(p));
      });
    return paths;
  },
  fields: fields,
  types: types,
  selections: selections
};

/**
 * get list of vcard objects
 *
 * @param {string} filter - to reduce list, optional
 * @param {string} sort - to sort list
 * @returns {array} vcard list
 */
function list(filter, sort) {
  let result = [];
  if (filter) {
    Object.values(lists[datasetName]).forEach((item) => {
      if (item.matches(filter)) {
        result.push(item);
      }
    });
  } else if (lists[datasetName]) {
    result = Object.values(lists[datasetName]);
  }
  if (sort) {
    result.sort(
      function (a, b) {
        if (a.text[sort] > b.text[sort]) {
          return 1;
        }
        if (a.text[sort] < b.text[sort]) {
          return -1;
        }
        return 0;
      }
    );
  }
  return result;
}

/**
 * open file
 *
 * @param {string} filename - to open
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
          datasetName = name.replace(/\.vcf$/, '');
          lists[datasetName] = parseVcfBuffer(buffer);
          resolve(oldDatasetName);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * upload file
 *
 * @param {object} file - to open
 * @returns {Promise} with parsed buffer // TODO buffer not needed?
 */
function uploadFile(file) {
  const oldDatasetName = datasetName;
  return new Promise(function (resolve, reject) {
    try {
      datasetName = path.basename(file.originalname).replace(/\.vcf$/, '');
      lists[datasetName] = parseVcfBuffer(file.buffer);
      resolve(oldDatasetName);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * parse vcf buffer
 *
 * @param {Buffer} buffer - to parse
 * @returns {Array} with parsed vcards
 */
function parseVcfBuffer(buffer) {
  let vcards = {};
  const data = Vcf.parse(buffer);
  data.forEach((item, id) => {
    const vcard = new Vcard(item, id);
    vcards[id] = vcard;
    updateGlobals(vcard);
  });
  return vcards;
}

/**
 * make vcard object from form data
 *
 * @param {object} index - in list
 * @param {object} data - data for new vcard
 * @param {object} files - list with files
 */
function data2vcard(index, data, files) {
  const dataKeys = Object.keys(data);
  const vcard = new Vcard(new Vcf(), index);
  Object.keys(fields).forEach((name) => {
    const field = fields[name];
    if (field.type === 'list') {
      const re = new RegExp('^' + name + '([0-9]*)(' +
                            (field.parts ? '_' + field.parts_order[0] : '') + ')?$');
      dataKeys.forEach(key => {
        const match = re.exec(key);
        if (match) {
          const value = dataValue(data, name + match[1], field.parts);
          if (value) {
            vcard.prop[name] = { value: value, params: dataParams(data, name + match[1]) };
            if (vcard.fields.indexOf(name) < 0) {
              vcard.fields.push(name);
            }
          }
        }
      });
    } else if (field.type === 'image' && files && files.length) {
      files.forEach(file => {
        if (file.fieldname === name) {
          vcard.prop[name] = {
            value: file.buffer.toString('base64'),
            params: { encoding: 'BASE64', type: file.mimetype.replace(/^.+\//, '') }
          };
        }
      });
    } else {
      const value = dataValue(data, name, field.parts);
      if (value) {
        vcard.prop[name] = { value: value, params: dataParams(data, name) };
        if (vcard.fields.indexOf(name) < 0) {
          vcard.fields.push(name);
        }
      }
    }
  });
  if (data.version) {
    vcard.vcard.version = data.version;
  }
  updateGlobals(vcard);
  return vcard;
}

/**
 * get global values from vcard
 *
 * @param {object} vcard - data for new vcard
 */
function updateGlobals(vcard) {
  vcard.fields.forEach(name => {
    if (fields[name]) {
      if (fields[name].selection) {
        if (selections[name] === undefined) {
          selections[name] = [];
        }
        if (fields[name].type === 'list') {
          vcard.prop[name].forEach(prop => {
            const value = prop.value;
            if (selections[name].indexOf(value) < 0) {
              selections[name].push(value);
            }
          });
        } else {
          const value = vcard.prop[name].value;
          if (selections[name].indexOf(value) < 0) {
            selections[name].push(value);
          }
        }
      }
    } else {
      console.log(
        'undefined field',
        name,
        vcard.get('fn').valueOf(),
        vcard.get(name).valueOf(),
        vcard.get(name)
      );
    }
  });
}

/**
 * get value from form data
 *
 * @param {object} data - data for new vcard
 * @param {string} name - fieldname
 * @param {object} parts - parts for entry
 */
function dataValue(data, name, parts) {
  let value;
  if (parts) {
    if (data[name] && data[name].indexOf('{') === 0) {
      value = JSON.parse(data[name]);
    } else {
      value = {};
      parts.forEach(part => {
        if (data[name + '_' + part]) {
          value[part] = data[name + '_' + part] || '';
        }
      });
    }
  } else {
    value = data[name];
  }
  return value;
}

/**
 * get params map from form data
 *
 * @param {object} data - data for new vcard
 * @param {string} name - fieldname
 */
function dataParams(data, name) {
  let params = {};
  if (data[name + '_type']) {
    params.type = data[name + '_type'];
  }
  if (data[name + '_encoding']) {
    params.encoding = data[name + '_encoding'];
    params.charset = 'UTF-8';
  }
  if (data[name + '_charset']) {
    params.charset = data[name + '_charset'];
  }
  return params;
}

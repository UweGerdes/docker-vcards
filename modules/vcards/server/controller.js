/**
 * # Controller for vCard
 */
'use strict';

const { body, validationResult } = require('express-validator/check'),
  { sanitizeBody } = require('express-validator/filter'),
  path = require('path'),
  vcards = require('./model.js')
  ;

let data,
  list = [],
  viewBase = path.join(path.dirname(__dirname), 'views')
  ;

module.exports = {
  /**
   * ### init
   *
   * @param {string} filename - to open
   */
  init: (filename) => {
    vcards.open(filename)
    .then(function (res) {
      data = res;
      //data.forEach((card) => { // jscs:ignore jsDoc
      //  list.push(new vcards.Vcard(card));
      //});
      list = vcards.list();
      return data;
    });
  },

  /**
   * ### index page
   *
   * @task index
   * @namespace vcard
   * @param {object} req - request
   * @param {object} res - result
   */
  index: (req, res) => {
    res.render(path.join(viewBase, 'index.pug'), {
      vcards: data,
      vcard: req.params.id ? vcards.list()[parseInt(req.params.id)] : null,
      title: 'vcard',
      livereload: 'http://172.25.0.2:8081/livereload.js',
      label: label,
      labels: labels,
      type: type,
      types: types,
      timestamp: timestamp,
      unCsv: unCsv
    });
  },

  /**
   * ### list
   *
   * @task list
   * @namespace vcard
   * @param {object} req - request
   * @param {object} res - result
   */
  list: (req, res) => {
    res.render(path.join(viewBase, 'list.pug'), {
      vcards: data,
      title: 'vcard',
      unCsv: unCsv
    });
  },

  /**
   * ### search
   *
   * @task search
   * @namespace vcard
   * @param {object} req - request
   * @param {object} res - result
   */
  search: [
    body('searchFields', 'Feld auswählen').isLength({ min: 1 }).trim(),
    body('searchString', 'Suchwort eintragen').isLength({ min: 1 }).trim(),
    sanitizeBody('searchString').trim().escape(),
    (req, res) => { // jscs:ignore jsDoc
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(404).render(path.join(viewBase, 'errors.pug'), { // jscs:ignore jsDoc
          errors: errors.array()
        });
      } else {
        res.render(path.join(viewBase, 'result.pug'), {
          vcards: vcards.list(req.body),
          title: 'vcard',
          unCsv: unCsv
        });
      }
    }
  ]
};

const labels = {
  version: 'Version',
  n: 'Name',
  fn: 'Anzeigename',
  tel: 'Telefon',
  adr: 'Adresse',
  email: 'E-Mail',
  url: 'Homepage',
  rev: 'Timestamp'
};
/**
 * ### label
 *
 * make readable labels
 *
 * @private
 * @namespace vcard
 * @param {string} value - to convert
 */
const label = (value) => {
  return labels[value] || '- ' + value + ' -';
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
 * ### split types
 *
 * make readable types
 *
 * @private
 * @namespace vcard
 * @param {string} value - to convert
 */
const type = (value) => {
  let list = [];
  if (value) {
    if (typeof value == 'string' && value.length > 0) {
      list.push(types[value] || value);
    } else {
      value.forEach((item) => { // jscs:ignore jsDoc
        list.push(types[item] || item);
      });
    }
  }
  return list;
};

/**
 * ### timestamp
 *
 * convert timestamp to local
 *
 * @private
 * @namespace vcard
 * @param {string} value - to convert
 */
const timestamp = (value) => {
  const date = new Date(value);
  return date.toLocaleString();
};

/**
 * ### unCsv
 *
 * trim ';', replace ';' with ', '
 *
 * @private
 * @namespace vcard
 * @param {string} value - to convert
 */
const unCsv = (value) => {
  return value
    .replace(/^;*(.+?);*$/, '$1')
    .replace(/;+/g, ', ');
};

/**
 * ## Controller for vCard
 *
 * @module vcards/controller
 */
'use strict';

const { body, validationResult } = require('express-validator/check'),
  { sanitizeBody } = require('express-validator/filter'),
  path = require('path'),
  model = require('./model.js')
  ;

let data,
  vcards = [],
  viewBase = path.join(path.dirname(__dirname), 'views')
  ;

/**
 * ### init
 *
 * open a vcf file
 *
 * @param {string} filename - to open
 */
const init = (filename) => {
  model.open(filename)
  .then(function (res) {
    data = res;
    //data.forEach((card) => { // jscs:ignore jsDoc
    //  vcards.push(new model.Vcard(card));
    //});
    vcards = model.list();
    return data;
  });
};

/**
 * ### index page
 *
 * render the index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const index = (req, res) => {
  res.render(path.join(viewBase, 'index.pug'), {
    vcards: data,
    vcard: req.params.id ? model.list()[parseInt(req.params.id)] : null,
    title: 'vcard',
    livereload: 'http://172.25.0.2:8081/livereload.js',
    label: label,
    labels: labels,
    type: type,
    types: types,
    timestamp: timestamp,
    unCsv: unCsv
  });
};

/**
 * ### list
 *
 * render the list snippet
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const list = (req, res) => {
  res.render(path.join(viewBase, 'list.pug'), {
    vcards: data,
    title: 'vcard',
    unCsv: unCsv
  });
};

/**
 * ### search
 *
 * search for vcards, render result snippet or error
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const search = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(404).render(path.join(viewBase, 'errors.pug'), { // jscs:ignore jsDoc
      errors: errors.array()
    });
  } else {
    res.render(path.join(viewBase, 'result.pug'), {
      vcards: model.list(req.body),
      title: 'vcard',
      unCsv: unCsv
    });
  }
};

module.exports = {
  init: init,
  index: index,
  list: list,
  search: [
    body('searchFields', 'Feld auswählen').isLength({ min: 1 }).trim(),
    body('searchString', 'Suchwort eintragen').isLength({ min: 1 }).trim(),
    sanitizeBody('searchString').trim().escape(),
    search
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
 * @param {string} value - to convert
 */
const type = (value) => {
  let typelist = [];
  if (value) {
    if (typeof value == 'string' && value.length > 0) {
      typelist.push(types[value] || value);
    } else {
      value.forEach((item) => { // jscs:ignore jsDoc
        typelist.push(types[item] || item);
      });
    }
  }
  return typelist;
};

/**
 * ### timestamp
 *
 * convert timestamp to local
 *
 * @private
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
 * @param {string} value - to convert
 */
const unCsv = (value) => {
  return value
    .replace(/^;*(.+?);*$/, '$1')
    .replace(/;+/g, ', ');
};

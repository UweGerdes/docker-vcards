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

const viewBase = path.join(path.dirname(__dirname), 'views');

/**
 * ### init
 *
 * open a vcf file
 *
 * @param {string} filename - to open
 */
const init = (filename) => {
  model.open(filename)
  .then(function (data) {
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
    vcards: model.list(),
    id: req.params.id ? req.params.id : '',
    vcard: req.params.id ? model.list()[parseInt(req.params.id)] : null,
    title: 'vcard',
    livereload: 'http://172.25.0.2:8081/livereload.js',
    fields: model.fields,
    type: type,
    types: model.types,
    timestamp: timestamp,
    unCsv: unCsv
  });
};

/**
 * ### edit page
 *
 * render the edit page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const edit = (req, res) => {
  res.render(path.join(viewBase, 'index.pug'), {
    vcards: model.list(),
    id: req.params.id,
    vcard: model.list()[parseInt(req.params.id)],
    title: 'vcard',
    edit: true,
    livereload: 'http://172.25.0.2:8081/livereload.js',
    fields: model.fields,
    type: type,
    types: model.types,
    timestamp: timestamp,
    unCsv: unCsv
  });
};

/**
 * ### merge page
 *
 * render the merge page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const merge = (req, res) => {
  res.render(path.join(viewBase, 'index.pug'), {
    vcards: model.list(),
    id: req.params.id1,
    id1: req.params.id1,
    id2: req.params.id2,
    vcard1: model.list()[parseInt(req.params.id1)],
    vcard2: model.list()[parseInt(req.params.id2)],
    title: 'vcard merge',
    merge: true,
    livereload: 'http://172.25.0.2:8081/livereload.js',
    fields: model.fields,
    type: type,
    types: model.types,
    timestamp: timestamp,
    unCsv: unCsv
  });
};

/**
 * ### save changes
 *
 * save input and render the index page
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const save = (req, res) => {
  model.save(parseInt(req.params.id), req.body);
  res.render(path.join(viewBase, 'index.pug'), {
    vcards: model.list(),
    id: req.params.id ? req.params.id : '',
    vcard: req.params.id ? model.list()[parseInt(req.params.id)] : null,
    title: 'vcard',
    livereload: 'http://172.25.0.2:8081/livereload.js',
    fields: model.fields,
    type: type,
    types: model.types,
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
    vcards: model.list(),
    title: 'vcard',
    unCsv: unCsv
  });
};

/**
 * ### inputType
 *
 * render the input-type snippet
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const inputType = (req, res) => {
  res.render(path.join(viewBase, 'input-type.pug'), {
    field: req.params.field,
    index: req.params.index || '',
    type: req.params.type,
    fields: model.fields,
    types: model.types
  });
};

/**
 * ### inputField
 *
 * render the input snippet
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const inputField = (req, res) => {
  res.render(path.join(viewBase, 'input.pug'), {
    field: req.params.field,
    index: req.params.index,
    fields: model.fields,
    types: model.types
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
      id: req.params.id ? req.params.id : '',
      title: 'vcard',
      unCsv: unCsv
    });
  }
};

module.exports = {
  init: init,
  index: index,
  edit: edit,
  merge: merge,
  save: save,
  list: list,
  inputType: inputType,
  inputField: inputField,
  search: [
    body('searchFields', 'Feld auswählen').isLength({ min: 1 }).trim(),
    body('searchString', 'Suchwort eintragen').isLength({ min: 1 }).trim(),
    sanitizeBody('searchString').trim().escape(),
    search
  ]
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
      typelist.push(model.types[value] || value);
    } else {
      value.forEach((item) => { // jscs:ignore jsDoc
        typelist.push(model.types[item] || item);
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

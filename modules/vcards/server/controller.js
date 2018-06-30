/**
 * ## Controller for vCard
 *
 * @module vcards/controller
 */
'use strict';

const { body, validationResult } = require('express-validator/check'),
  { sanitizeBody } = require('express-validator/filter'),
  path = require('path'),
  config = require('../../../lib/config'),
  model = require('./model.js')
  ;

const viewBase = path.join(path.dirname(__dirname), 'views');

const viewRenderParams = {
  // model data
  fields: model.fields,
  types: model.types,
  // view helper functions
  type: type,
  timestamp: timestamp,
  unCsv: unCsv
};
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
  if (req.params.delId && req.params.delId.match(/^[0-9]+$/)) {
    console.log('delete:', req.params.delId);
    model.del(parseInt(req.params.delId));
  }
  let datasetName = '';
  if (req.cookies && req.cookies.datasetName) {
    datasetName = req.cookies.datasetName;
    console.log('cookie datasetName', datasetName);
    model.datasetName = datasetName;
  }
  let vcard = req.params.id ? model.list()[parseInt(req.params.id)] : null;
  if (req.params.editId) {
    vcard = model.list()[parseInt(req.params.editId)];
  }
  let data = Object.assign({
      title: 'vcard',
      vcard: vcard,
    },
    req.params,
    getModelData(req),
    getHostData(req),
    viewRenderParams
  );
  res.render(path.join(viewBase, 'index.pug'), data);
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
  res.render(path.join(viewBase, 'index.pug'),
    Object.assign({
      title: 'vcard merge',
      vcard: model.list()[parseInt(req.params.id)],
      vcard2: model.list()[parseInt(req.params.id2)]
    },
    req.params,
    getModelData(req),
    getHostData(req),
    viewRenderParams)
  );
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
  res.render(path.join(viewBase, 'index.pug'),
      Object.assign({
      title: 'vcard',
      id: req.params.id,
      delId: req.params.delId ? req.params.delId : '',
      vcard: req.params.id ? model.list()[parseInt(req.params.id)] : null
    },
    getModelData(req),
    getHostData(req),
    viewRenderParams)
  );
};

/**
 * ### switchDataset
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const switchDataset = (req, res) => {
  const oldDatasetName = model.datasetName();
  // console.log('switch from ' + oldDatasetName + ' to ' + req.params.name);
  model.switchDataset(req.params.name)
  .then(() => { // jscs:ignore jsDoc
    res.cookie('datasetName', req.params.name, { maxAge: 900000, httpOnly: true }).
      render(path.join(viewBase, 'index.pug'),
        Object.assign({
          title: 'vcard',
          oldDatasetName: oldDatasetName
        },
        getModelData(req),
        getHostData(req),
        viewRenderParams)
      )
    ;
  })
  .catch((error) => { // jscs:ignore jsDoc
    console.log('switchDataset error:', error);
    res.clearCookie('datasetName').
      render(path.join(viewBase, 'index.pug'),
        Object.assign({
          title: 'vcard - file not found error'
        },
        getModelData(req),
        getHostData(req),
        viewRenderParams)
      )
    ;
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

/**
 * ### download
 *
 * download the list
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const download = (req, res) => {
  let content;
  if (req.params.type == 'json') {
    res.set('Content-disposition', 'attachment; filename=vcards.json');
    res.set('Content-Type', 'application/json');
    content = model.toJSON();
  } else {
    res.set('Content-disposition', 'attachment; filename=vcards.vcf');
    res.set('Content-Type', 'text/vcard');
    content = model.toVCF();
  }
  res.send(content);
};

module.exports = {
  init: init,
  index: index,
  merge: merge,
  save: [
    body('fn', model.fields.fn.label).isLength({ min: 1 }).trim(),
    sanitizeBody('fn').trim().escape(),
    save],
  list: list,
  switchDataset: switchDataset,
  inputType: inputType,
  inputField: inputField,
  search: search,
  download: download
};

/**
 * ### split types
 *
 * make readable types
 *
 * @private
 * @param {string} value - to convert
 */
function type(value) {
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
}

/**
 * ### timestamp
 *
 * convert timestamp to local
 *
 * @private
 * @param {string} value - to convert
 */
function timestamp(value) {
  const date = new Date(value);
  return date.toLocaleString();
}

/**
 * ### unCsv
 *
 * trim ';', replace ';' with ', '
 *
 * @private
 * @param {string} value - to convert
 */
function unCsv(value) {
  return value
    .replace(/^;*(.+?);*$/, '$1')
    .replace(/;+/g, ', ');
}

/**
 * Get the model data elements
 *
 * @private
 */
function getModelData() {
  return {
    vcards: model.list(),
    datasetNames: model.datasetNames(),
    datasetName: model.datasetName(),
    datasetFiles: model.datasetFiles(),
  };
}

/**
 * Get the host data for livereload
 *
 * @private
 * @param {String} req - request
 */
function getHostData(req) {
  let livereloadPort = config.server.livereloadPort;
  const host = req.get('Host');
  if (host.indexOf(':') > 0) {
    livereloadPort = parseInt(host.split(':')[1]) + 1;
  }
  return {
    hostname: req.hostname,
    livereloadPort: livereloadPort
  };
}

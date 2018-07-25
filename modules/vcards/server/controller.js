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
  type: type
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
  let sort = '';
  if (req.cookies) {
    if (req.cookies.datasetName) {
      model.switchDataset(req.cookies.datasetName);
    }
  }
  if (req.params.hasOwnProperty('sort')) {
    sort = req.params.sort;
    res.cookie('sort', sort, { maxAge: 12 * 60 * 60 * 1000, httpOnly: true });
  }
  let vcard = req.params.id ? model.get(parseInt(req.params.id)) : null;
  if (req.params.editId) {
    vcard = model.get(parseInt(req.params.editId));
  }
  let vcard2 = req.params.id2 ? model.get(parseInt(req.params.id2)) : null;
  let data = Object.assign({
      title: 'vcard',
      vcard: vcard,
      vcard2: vcard2
    },
    req.params,
    getModelData(req),
    getHostData(req),
    viewRenderParams
  );
  res.render(path.join(viewBase, 'index.pug'), data);
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
  model.save(parseInt(req.params.id), req.body, req.files);
  res.render(path.join(viewBase, 'index.pug'),
      Object.assign({
      title: 'vcard',
      id: req.params.id,
      delId: req.params.delId ? req.params.delId : '',
      vcard: req.params.id ? model.get(parseInt(req.params.id)) : null
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
    res.cookie('datasetName', req.params.name, { maxAge: 900000, httpOnly: true })
      .render(path.join(viewBase, 'index.pug'),
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
    title: 'vcard'
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
    i: req.params.i || '0',
    type: req.params.type,
    fields: model.fields,
    types: model.types
  });
};

/**
 * ### inputInput
 *
 * render the input snippet
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const inputInput = (req, res) => {
  res.render(path.join(viewBase, 'input-input.pug'), {
    field: req.params.field,
    index: req.params.index,
    fields: model.fields,
    types: model.types
  });
};

/**
 * ### inputField
 *
 * render the field snippet
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const inputField = (req, res) => {
  res.render(path.join(viewBase, 'input-field.pug'), {
    field: req.params.field,
    index: model.fields[req.params.field].type == 'list' ? '0' : '',
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
      title: 'vcard'
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

/**
 * ### upload
 *
 * upload .vcf file
 *
 * @param {object} req - request
 * @param {object} res - result
 */
const upload = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(404).render(path.join(viewBase, 'errors.pug'), { // jscs:ignore jsDoc
      errors: errors.array()
    });
  } else {
    const oldDatasetName = model.datasetName();
    console.log('switch from ' + oldDatasetName + ' to ', req.file);
    res.render(path.join(viewBase, 'index.pug'),
        Object.assign({
        title: 'vcard',
      },
      getModelData(req),
      getHostData(req),
      viewRenderParams)
    );
    /*
    model.switchDataset(req.params.name)
    .then(() => { // jscs:ignore jsDoc
      res.cookie('datasetName', req.params.name, { maxAge: 900000, httpOnly: true })
        .render(path.join(viewBase, 'index.pug'),
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
    */
  }
};

module.exports = {
  init: init,
  index: index,
  save: [
    body('fn', model.fields.fn.label).isLength({ min: 1 }).trim(),
    sanitizeBody('fn').trim().escape(),
    save],
  list: list,
  switchDataset: switchDataset,
  inputType: inputType,
  inputInput: inputInput,
  inputField: inputField,
  search: search,
  download: download,
  upload: upload
};

/**
 * ### translate types
 *
 * @private
 * @param {object} value - string or list to translate
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
 * Get the model data elements
 *
 * @private
 * @param {object} req - request
 */
function getModelData(req) {
  let list = model.list();
  let sort = '';
  if (req.params.sort) {
    sort = req.params.sort;
  } else if (req.cookies && req.cookies.sort) {
    sort = req.cookies.sort;
  }
  if (sort) {
    if (sort == 'id') {
      list.sort(
        function (a, b) {
          if (a.id > b.id) {
            return 1;
          } else {
            return -1;
          }
        }
      );
    } else {
      list.sort(
        function (a, b) {
          if (!a.get(sort) && !b.get(sort)) {
            return 0;
          } else
          if (a.get(sort) && !b.get(sort)) {
            return -1;
          } else
          if (!a.get(sort) && b.get(sort)) {
            return 1;
          } else
          if (a.get(sort).valueOf() > b.get(sort).valueOf()) {
            return 1;
          } else
          if (a.get(sort).valueOf() < b.get(sort).valueOf()) {
            return -1;
          }
          return 0;
        }
      );
    }
  }
  return {
    vcards: list,
    datasetNames: model.datasetNames(),
    datasetName: model.datasetName(),
    datasetFiles: model.datasetFiles(),
    sort: sort
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

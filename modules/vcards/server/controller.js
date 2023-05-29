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
  model = require('./model.js');
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
    model.del(parseInt(req.params.delId, 10));
    req.params.delId = null;
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
  let vcard = req.params.id ? model.get(parseInt(req.params.id, 10)) : null;
  if (req.params.editId) {
    vcard = model.get(parseInt(req.params.editId, 10));
  }
  let vcard2 = req.params.id2 ? model.get(parseInt(req.params.id2, 10)) : null;
  let data = Object.assign(
    {
      title: 'vcard',
      vcard: vcard,
      vcard2: vcard2
    },
    req.params,
    getModelData(req),
    getHostData(req),
    config.getData(req),
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
  model.save(parseInt(req.params.id, 10), req.body, req.files);
  res.render(
    path.join(viewBase, 'index.pug'),
    Object.assign(
      {
        title: 'vcard',
        id: req.params.id,
        delId: req.params.delId ? req.params.delId : '',
        vcard: req.params.id ? model.get(parseInt(req.params.id, 10)) : null
      },
      getModelData(req),
      getHostData(req),
      config.getData(req),
      viewRenderParams
    )
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
  model.switchDataset(req.params.name)
    .then(() => {
      res.cookie('datasetName', req.params.name, { maxAge: 900000, httpOnly: true })
        .render(
          path.join(viewBase, 'index.pug'),
          Object.assign(
            {
              title: 'vcard',
              oldDatasetName: oldDatasetName
            },
            getModelData(req),
            getHostData(req),
            config.getData(req),
            viewRenderParams
          )
        );
    })
    .catch((error) => {
      console.log('switchDataset error:', error);
      res.clearCookie('datasetName')
        .render(
          path.join(viewBase, 'index.pug'),
          Object.assign(
            {
              title: 'vcard - file not found error'
            },
            getModelData(req),
            getHostData(req),
            config.getData(req),
            viewRenderParams
          )
        );
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
  res.render(path.join(viewBase, 'parts', 'list.pug'), {
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
  res.render(path.join(viewBase, 'edit', 'type.pug'), {
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
  res.render(path.join(viewBase, 'edit', 'input.pug'), {
    field: req.params.field,
    value: req.params.value,
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
  res.render(path.join(viewBase, 'edit', 'field.pug'), {
    field: req.params.field,
    index: model.fields[req.params.field].type === 'list' ? '0' : '',
    fields: model.fields,
    types: model.types,
    selections: model.selections
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
    res.status(404).render(path.join(viewBase, 'errors.pug'), {
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
  let sort = '';
  if (req.params.sort) {
    sort = req.params.sort;
  } else if (req.cookies && req.cookies.sort) {
    sort = req.cookies.sort;
  }
  if (req.params.type === 'json') {
    res.set('Content-disposition', 'attachment; filename=vcards.json');
    res.set('Content-Type', 'application/json');
    content = model.toJSON();
  } else {
    res.set('Content-disposition', 'attachment; filename=vcards.vcf');
    res.set('Content-Type', 'text/vcard');
    content = model.toVCF(null, sort);
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
    res.status(404).render(path.join(viewBase, 'errors.pug'), {
      errors: errors.array()
    });
  } else {
    const oldDatasetName = model.datasetName();
    model.upload(req.file)
      .then(() => {
        res.cookie(
          'datasetName',
          path.basename(req.file.originalname),
          { maxAge: 900000, httpOnly: true }
        )
          .render(
            path.join(viewBase, 'index.pug'),
            Object.assign(
              {
                title: 'vcard',
                oldDatasetName: oldDatasetName
              },
              getModelData(req),
              getHostData(req),
              config.getData(req),
              viewRenderParams
            )
          );
      })
      .catch((error) => {
        console.log('switchDataset error:', error);
        res.render(
          path.join(viewBase, 'index.pug'),
          Object.assign(
            {
              title: 'vcard - file upload error'
            },
            getModelData(req),
            getHostData(req),
            config.getData(req),
            viewRenderParams
          )
        );
      });
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
    if (typeof value === 'string' && value.length > 0) {
      typelist.push(model.types[value] || value);
    } else {
      value.forEach((item) => {
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
  let sort = '';
  if (req.params.sort) {
    sort = req.params.sort;
  } else if (req.cookies && req.cookies.sort) {
    sort = req.cookies.sort;
  }
  let list = model.list(null, sort);
  return {
    vcards: list,
    datasetNames: model.datasetNames(),
    datasetName: model.datasetName(),
    datasetFiles: model.datasetFiles(),
    sort: sort,
    selections: model.selections
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
    livereloadPort = parseInt(host.split(':')[1], 10) + 1;
  }
  return {
    environment: process.env.NODE_ENV,
    hostname: req.hostname,
    livereloadPort: livereloadPort
  };
}

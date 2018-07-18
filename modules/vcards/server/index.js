/**
 * Routes for vCard
 */
'use strict';

const express = require('express'),
  multer  = require('multer'),
  upload = multer({ storage: multer.memoryStorage() }),
  path = require('path'),
  router = express.Router();

const controller = require('./controller.js');

controller.init(path.join(path.dirname(__dirname), 'data', 'userdata.vcf'));

// vcard overview
router.get('/', controller.index);

// download vcards
router.get('/download/:type?', controller.download);

// sort field route.
router.get('/sort/:sort?', controller.index);

// view id route.
router.get('/:id/', controller.index);

// edit id route.
router.get('/edit/:editId/', controller.index);

// merge id route.
router.get('/merge/:id/:id2/', controller.index);

// view id and delete delId route.
router.get('/:id/del/:delId', controller.index);

// switchDataset id route.
router.get('/dataset/:name/', controller.switchDataset);

// list vcards (only test)
router.get('/list/', controller.list);

// new type route
router.get('/type/:field/_:index?/:type/:i?', controller.inputType);

// new input route
router.get('/input/:field/:index', controller.inputInput);

// new field route
router.get('/field/:field/:index?', controller.inputField);

// search vcards
router.post('/search/:id?', upload.array(), controller.search);

// save vcard
router.post('/save/:id/:delId?', upload.any(), controller.save);

module.exports = router;

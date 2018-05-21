/**
 * Routes for vCard
 */
'use strict';

const express = require('express'),
  multer  = require('multer'),
  upload = multer(),
  path = require('path'),
  router = express.Router();

const controller = require('./controller.js');

controller.init(path.join(path.dirname(__dirname), 'tests', 'server', 'userdata.vcf'));

// vcard overview
router.get('/', controller.index);

// view id route.
router.get('/:id/', controller.index);

// edit id route.
router.get('/edit/:id/', controller.edit);

// edit id route.
router.get('/merge/:id1/:id2/', controller.merge);

// view id and delete delId route.
router.get('/:id/del/:delId', controller.index);

// switchDataset id route.
router.get('/dataset/:name/', controller.switchDataset);

// list vcards (only test)
router.get('/list/', controller.list);

// new type route
router.get('/type/:field/_:index?/:type', controller.inputType);

// new field route
router.get('/field/:field/:index', controller.inputField);

// search vcards
router.post('/search/:id?', upload.array(), controller.search);

// save vcard
router.post('/save/:id/:delId?', upload.array(), controller.save);

module.exports = router;

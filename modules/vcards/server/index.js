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

controller.init(path.join(path.dirname(__dirname), 'tests', 'testdata.vcf'));

// vcard overview
router.get('/', controller.index);

// view id route.
router.get('/:id/', controller.index);

// edit id route.
router.get('/edit/:id/', controller.edit);

// list vcards (only test)
router.get('/list/', controller.list);

// new type route
router.get('/type/:field/_:index?/:type', controller.inputType);

// new field route
router.get('/field/:field/:index', controller.inputField);

// search vcards
router.post('/search/:id?', upload.array(), controller.search);

// save vcard
router.post('/save/:id', upload.array(), controller.save);

module.exports = router;

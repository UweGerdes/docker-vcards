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

// list vcards
router.get('/list/', controller.list);

// edit id route.
router.get('/edit/:id/', controller.edit);

// new type route.
router.get('/type/:field/_:index?/:type', controller.inputType);

// new type route.
router.get('/field/:field/:index', controller.inputField);

// view id route.
router.get('/:id/', controller.index);

// search vcards
router.post('/search/', upload.array(), controller.search);

module.exports = router;

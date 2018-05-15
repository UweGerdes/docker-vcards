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

controller.init(path.join(__dirname, 'tests', 'testdata.vcf'));

// Home page route.
router.get('/', controller.index);

// list vcards
router.get('/list/', controller.list);

// view id route.
router.get('/:id/', controller.index);

// search vcards
router.post('/search/', upload.array(), controller.search);

module.exports = router;

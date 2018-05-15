/**
 * Routes for vCard
 */
'use strict';

const express = require('express'),
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
router.post('/search/', controller.search);

module.exports = router;

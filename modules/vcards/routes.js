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
router.get('/list/', controller.list);

// About page route.
router.get('/:id/', function (req, res) {
  res.status(200).send(`vCard get ${req.params.id}`);
});

module.exports = router;

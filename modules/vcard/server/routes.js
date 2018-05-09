/**
 * Routes for vCard
 */
'use strict';

const express = require('express'),
  router = express.Router();

const controller = require('./controller.js');

// Home page route.
router.get('/', controller.list);

// About page route.
router.get('/:id/', function (req, res) {
  res.status(200).send(`vCard get ${req.params.id}`);
});

module.exports = router;

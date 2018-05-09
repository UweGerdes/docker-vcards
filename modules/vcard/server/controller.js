/**
 * # Controller for vCard
 */
'use strict';

const path = require('path'),
  vcards = require('../model/vcard.js');

let data;

module.exports = {
  /**
   * ### init
   *
   * @param {string} filename - to open
   */
  init: (filename) => {
    vcards.open(filename)
    .then(function (res) {
      data = res;
      return data;
    });
  },

  /**
   * ### list
   *
   * @task list
   * @namespace vcard
   * @param {object} req - request
   * @param {object} res - result
   */
  list: (req, res) => {
    res.render(path.join(__dirname, '..', 'views', 'index.ejs'), {
      vcards: data
    });

  }
};

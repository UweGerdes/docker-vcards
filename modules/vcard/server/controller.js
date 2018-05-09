/**
 * # Controller for vCard
 */
'use strict';

const vcards = require('../model/vcard.js');

let testData;

module.exports = {
  /**
   * ### init
   *
   * @param {string} filename - to open
   */
  init: (filename) => {
    vcards.open(filename)
    .then(function (data) {
      testData = data;
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
    res.send('<ul id="list"><li>test</li><li>test2</li></ul>');
  }
};

/**
 * # Controller for vCard
 */
'use strict';

const path = require('path'),
  vcards = require('./model.js')
  ;

let data,
  list = []
  ;

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
      data.forEach((card) => { // jscs:ignore jsDoc
        list.push(new vcards.Vcard(card));
      });
      return data;
    });
  },

  /**
   * ### index page
   *
   * @task index
   * @namespace vcard
   * @param {object} req - request
   * @param {object} res - result
   */
  index: (req, res) => {
    res.render(path.join(__dirname, 'views', 'index.pug'), {
      vcards: data,
      vcard: req.params.id ? list[parseInt(req.params.id)] : null,
      title: 'vcard',
      livereload: 'http://172.25.0.2:8081/livereload.js',
      label: label,
      unCsv: unCsv
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
    res.render(path.join(__dirname, 'views', 'list.pug'), {
      vcards: data,
      title: 'vcard'
    });
  }
};

/**
 * ### label
 *
 * make readable labels
 *
 * @private
 * @namespace vcard
 * @param {string} value - to convert
 */
const label = (value) => {
  const labels = {
    version: 'Version',
    n: 'Name',
    fn: 'Anzeigename',
    tel: 'Telefon',
    email: 'E-Mail',
    url: 'Homepage'
  }
  return labels[value] || value;
};

/**
 * ### unCsv
 *
 * trim ';', replace ';' with ', '
 *
 * @private
 * @namespace vcard
 * @param {string} value - to convert
 */
const unCsv = (value) => {
  return value
    .replace(/^;*(.+?);*$/, '$1')
    .replace(/;+/g, ', ');
};

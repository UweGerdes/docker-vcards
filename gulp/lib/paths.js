/**
 * @module lib:paths
 * @private
 */
'use strict';

const yaml = require('js-yaml'),
  fs = require('fs')
  ;

/**
 * Parse paths for all modules
 *
 * @private
 */
const paths = yaml.safeLoad(
    fs.readFileSync(__dirname + '/../../configuration.yaml', 'utf8')
   ).paths,
  watch  = paths.watch,
  build  = paths.build;

module.exports = {

  /**
   * Exports all paths
   */
  for: paths,

  /**
   * Returns path for watch task
   *
   * @param {string} task - name
   * @returns {array} - array with paths
   */
  forWatch: (task) => {
    if (!watch[task]) {
      throw ('watch path for ' + task + ' not defined in configuration.yaml');
    }
    return watch[task];
  },

  /**
   * Returns paths for build task
   *
   * @param {string} task - name
   * @returns {object} - src and dest paths
   */
  forBuild: (task) => {
    if (!build[task]) {
      throw ('build path for ' + task + ' not defined in configuration.yaml');
    }
    return build[task];
  }
};

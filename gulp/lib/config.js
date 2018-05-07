/**
 * @module lib:config
 * @private
 */
'use strict';

const yaml = require('js-yaml'),
  fs = require('fs')
  ;

/**
 * Parse config for all modules
 *
 * @private
 */
const config = yaml.safeLoad(
    fs.readFileSync(__dirname + '/../../configuration.yaml', 'utf8')
   ),
  watch  = config.gulp.watch,
  build  = config.gulp.build;

module.exports = {

  /**
   * Exports config
   */
  for: config,

  /**
   * Exports config
   */
  gulp: config.gulp,

  /**
   * Returns path for watch task
   *
   * @param {string} task - name
   * @returns {array} - array with config
   */
  forWatch: (task) => {
    if (!watch[task]) {
      throw ('watch path for ' + task + ' not defined in configuration.yaml');
    }
    return watch[task];
  },

  /**
   * Returns config for build task
   *
   * @param {string} task - name
   * @returns {object} - src and dest config
   */
  forBuild: (task) => {
    if (!build[task]) {
      throw ('build path for ' + task + ' not defined in configuration.yaml');
    }
    return build[task];
  }
};

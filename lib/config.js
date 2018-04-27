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
    fs.readFileSync(__dirname + '/../configuration.yaml', 'utf8')
   );

module.exports = {

  /**
   * Exports all config settings
   */
  config: config,

  /**
   * Returns path for watch task
   *
   * @param {string} task - name
   * @returns {array} - array with paths
   */
  pathsForWatch: (task) => {
    if (!config.paths.watch[task]) {
      throw ('watch path for ' + task + ' not defined in configuration.yaml');
    }
    return config.paths.watch[task];
  },

  /**
   * Returns paths for build task
   *
   * @param {string} task - name
   * @returns {object} - src and dest paths
   */
  pathsForBuild: (task) => {
    if (!config.paths.build[task]) {
      throw ('build path for ' + task + ' not defined in configuration.yaml');
    }
    return config.paths.build[task];
  }
};

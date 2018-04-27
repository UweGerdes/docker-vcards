/**
 * @module lib:paths
 * @private
 */
'use strict';

const yaml = require('js-yaml'),
    fs = require('fs')
    ;

/**
 * Parse all paths and populate the directories with their roots if any.
 *
 * @private
 */
/*
const normalizePaths = (paths) => {
    let result  = {};
    const recurse = (cursor, adder, prop) => {
            if (_.isString(cursor)) {
                if (prop !== 'root') {
                    result[prop] = adder + cursor;
                }
            } else if (_.isArray(cursor)) {
                result[prop] = cursor.map((item) => {
                    return adder + item;
                });
            } else {
                let isEmpty = true;
                if (cursor.root) {
                    adder += cursor.root;
                    result[prop ? prop : 'root'] = adder;
                }
                Object.keys(cursor).forEach((key) => {
                    isEmpty = false;
                    recurse(cursor[key], adder, key);
                });
                if (isEmpty && prop) {
                    result[prop] = {};
                }
            }
        };
    recurse(paths, '', '');
    return result;
};
*/

/**
 * Parse paths for all modules
 *
 * @private
 */
const paths = yaml.safeLoad(
      fs.readFileSync(__dirname + '/../../configuration.yaml', 'utf8')
   ).paths,
    watch  = paths.watch;

/**
 * Export helpers
 */
module.exports = {
    /**
     * Exports all paths
     */
    for: paths,
    /**
     * Returns path for watch
     *
     * @param [path] {string}
     * @returns {string}
     */
    forWatch: (path) => {
      return watch[path] || '.';
    }
};

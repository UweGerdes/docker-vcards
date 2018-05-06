/**
 * @module test
 */
'use strict';

const fs = require('fs'),
  glob = require('glob'),
  gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  sequence = require('gulp-sequence'),
  request = require('request'),
  paths = require('./lib/paths'),
  loadTasks = require('./lib/load-tasks')
  ;

let runningTests = { };

const tasks = {
  /**
   * ### Default gulp test task
   *
   * @task test
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'test': (callback) => {
    sequence(
      'test-mocha',
//      'test-compare-layouts',
      callback
    );
  },
  /**
   * ### test mocha
   *
   * @task test-mocha
   * @namespace tasks
   */
  'test-mocha': () => {
    gulp.src(paths.for.tests.mocha.vcard, { read: false })
      // `gulp-mocha` needs filepaths so you can't have any plugins before it
      .pipe(mocha({ reporter: 'list' }))
      .on('error', () => { }) // jscs:ignore jsDoc
    ;
  },
  /**
   * #### testing
   *
   * @task test-compare-layouts
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'test-compare-layouts': (callback) => {
    getFilenames(paths.for.watch['test-compare-layouts'])
    .then(getRecentFile)
    .then((filename) => { // jscs:ignore jsDoc
      console.log('filename', filename);
      return filename;
    })
    .then(getRequest)
    .then((result) => { // jscs:ignore jsDoc
      return result;
    })
    .then(() => { // jscs:ignore jsDoc
      callback();
    })
    ;
  },
  /**
   * #### Execute compare-layouts tests
   *
   * executes a request to compare-layouts server
   *
   * @task test-compare-layouts
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'test-test': (callback) => {
    const taskName = 'test-compare-layouts';
    if (!runningTests[taskName]) {
      runningTests[taskName] = true;
      // const url = request.get('http://vcard-compare-layouts:8080/run/default').pipe(res);
      // request.get({ uri: 'http://vcard-compare-layouts:8080/run/default' });
      request('http://vcard-compare-layouts:8080/run/default',
        (error, response, body) => { // jscs:ignore jsDoc
          console.log('error:', error);
          console.log('statusCode:', response && response.statusCode);
          console.log(body);
          runningTests[taskName] = false;
          callback();
        }
      );
    }
  }
};
/**
 * get list of files for glob pattern
 *
 * @private
 * @param {function} paths - patterns for paths
 */
const getFilenames = (paths) => {
  return new Promise((resolve, reject) => { // jscs:ignore jsDoc
    paths.forEach((path) => { // jscs:ignore jsDoc
      glob(path, (error, files) => { // jscs:ignore jsDoc
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });
  });
};

/**
 * get newest file from glob list - synchronous
 *
 * @param {array} files - list with glob paths
 */
function getRecentFile(files) {
  let newest = null;
  let bestTime = 0;
  for (let i = 0; i < files.length; i++) {
    const fileTime = fs.statSync(files[i]).mtime.getTime();
    if (fileTime > bestTime) {
      newest = files[i];
      bestTime = fileTime;
    }
  }
  return new Promise((resolve) => { // jscs:ignore jsDoc
    resolve(newest);
  });
}

/**
 * get request with
 *
 * @param {array} file - list with glob paths
 */
function getRequest(file) {
  return new Promise((resolve) => { // jscs:ignore jsDoc
    const testPath = file.replace(/(.+)\/views\/.+/, '$1');
    /*
     request('http://vcard-compare-layouts:8080/run/default',
      (error, response, body) => { // jscs:ignore jsDoc
      });
    */
    resolve(testPath);
  });
}

loadTasks.importTasks(tasks);

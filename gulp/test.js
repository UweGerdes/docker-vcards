/**
 * @module test
 */
'use strict';

const gulp = require('gulp'),
  changedInPlace = require('gulp-changed-in-place'),
  notify = require('gulp-notify'),
  sequence = require('gulp-sequence'),
  request = require('request'),
  paths = require('./lib/paths'),
  loadTasks = require('./lib/load-tasks')
  ;

let runningTests = { };

/**
 * log only to console, not GUI
 *
 * @param {pbject} options - setting options
 * @param {function} callback - gulp callback
 */
const log = notify.withReporter((options, callback) => {
  callback();
});

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
      'test-compare-layouts',
      callback
    );
  },
  /**
   * #### testing
   *
   * @task test-compare-layouts
   * @namespace tasks
   */
  'test-compare-layouts': () => {
    return gulp.src(paths.for.watch['test-compare-layouts'])
      .pipe(changedInPlace({ howToDetermineDifference: 'modification-time' }))
      .pipe(log({ message: 'compare-layouts: <%= file.path %>',
        title: 'Gulp test-compare-layouts' }))
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
    if (!runningTests['test-test']) {
      runningTests['test-test'] = true;
      // const url = request.get('http://vcard-compare-layouts:8080/run/default').pipe(res);
      // request.get({ uri: 'http://vcard-compare-layouts:8080/run/default' });
      request('http://vcard-compare-layouts:8080/run/default',
        (error, response, body) => { // jscs:ignore jsDoc
          console.log('error:', error);
          console.log('statusCode:', response && response.statusCode);
          console.log(body);
          runningTests['test-test'] = false;
          callback();
        }
      );
    }
  }
};

loadTasks.importTasks(tasks);

/**
 * @module test
 */
'use strict';

const gulp = require('gulp'),
  changedInPlace = require('gulp-changed-in-place'),
  notify = require('gulp-notify'),
  sequence = require('gulp-sequence'),
  paths = require('./lib/paths'),
  loadTasks = require('./lib/load-tasks')
  ;

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
   * #### Execute compare-layouts tests
   *
   * executes a request to compare-layouts server
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
  /*
  'default-test': () => {
    const url = request.get(paths.vendor[index++]).pipe(res);
    request.get({ uri: paths.vendor })
    return request(paths.for.test['compare-layouts'].src[0])
      .pipe(fs.createWriteStream('doodle.png'));
  }
  */
};

loadTasks.importTasks(tasks);

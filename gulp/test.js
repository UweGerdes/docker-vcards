/**
 * ## Gulp test tasks
 *
 * @module gulp/test
 */
'use strict';

const gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  notify = require('gulp-notify'),
  sequence = require('gulp-sequence'),
  config = require('../lib/config'),
  filePromises = require('./lib/files-promises'),
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
   * ### test
   *
   * @task test
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'tests': (callback) => {
    sequence(
      'test-vcards',
      callback
    );
  },
  /**
   * ### test-vcards
   *
   * @task test-vcards
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'test-vcards': [['jshint'], (callback) => {
      Promise.all(config.gulp.tests.vcards.map(filePromises.getFilenames))
      .then((filenames) => [].concat(...filenames)) // jscs:ignore jsDoc
      .then(filePromises.getRecentFiles)
      .then((filenames) => { // jscs:ignore jsDoc
        const self = gulp.src(filenames, { read: false })
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({ reporter: 'tap', timeout: 10000 })) // timeout for Raspberry Pi 3
        .on('error', function () { // jscs:ignore jsDoc
          self.emit('end');
        })
        .pipe(log({ message: 'tested: <%= file.path %>', title: 'Gulp test-vcards' }));
        return self;
      })
      .then(() => { // jscs:ignore jsDoc
        callback();
      })
      .catch(err => console.log(err)) // jscs:ignore jsDoc
      ;
    }
  ],
};

if (process.env.NODE_ENV == 'development') {
  loadTasks.importTasks(tasks);
}

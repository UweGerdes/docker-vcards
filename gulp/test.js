/**
 * ## Gulp test tasks
 *
 * @module gulp/test
 */
'use strict';

const gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  sequence = require('gulp-sequence'),
  config = require('../lib/config'),
  files = require('./lib/files-promises'),
  loadTasks = require('./lib/load-tasks')
  ;

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
      Promise.all(config.gulp.tests.vcards.map(files.getFilenames))
      .then((filenames) => [].concat(...filenames)) // jscs:ignore jsDoc
      .then(files.getRecentFiles)
      .then((filenames) => { // jscs:ignore jsDoc
        const self = gulp.src(filenames, { read: false })
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({ reporter: 'tap', timeout: 4000 })) // timeout for Raspberry Pi 3
        .on('error', function () { // jscs:ignore jsDoc
          self.emit('end');
        });
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

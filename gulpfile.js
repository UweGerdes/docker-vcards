/**
 * gulpfile for project vCard
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 *
 * Gulp uses configuration variables stored in `./configuration.yaml`
 *
 * @name gulp
 * @module
 *
 */
'use strict';

require('./gulp/build');
require('./gulp/lint');
require('./gulp/server');
require('./gulp/test');
require('./gulp/watch');

const gulp = require('gulp'),
  sequence = require('gulp-sequence')
  ;

/**
 * #### default task
 *
 * start build and watch, some needed for changedInPlace dryrun
 *
 * @param {function} callback - gulp callback
 */
gulp.task('default', (callback) => {
  if (process.env.NODE_ENV == 'development') {
    sequence(
      'lint',
      'build',
      'watch',
      'livereload-start',
      'server-start',
      'tests',
      callback);
  } else {
    sequence(
      'build',
      'watch',
      'livereload-start',
      'server-start',
      callback);
  }
});

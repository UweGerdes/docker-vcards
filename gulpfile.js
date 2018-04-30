/**
 * gulpfile for project vCard
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 *
 * ### Overview
 *
 * We are using [gulp](http://gulpjs.com/) as a build system. Gulp in
 * this project is responsible for a couple of things :
 *
 * 1. Compiles the project ( written in TypeScript ) to Javascript ;
 * 2. Helps during the development by watching for changes and
 *    compiles automatically.
 *
 * ### Structure
 *
 * Our gulp configuration starts in the root `./gulpfile.js`, which
 * loads all tasks in the directory `./gulp`.
 *
 * The gulp-task files itself are written according to JSDoc specs
 * to make generating the future documentation flawless.
 *
 * There is another special directory, called `./gulp/lib`, which
 * purpose is to store all non-gulptask files that have helpers
 * for the tasks (e.g. configuration options)
 *
 * ### External Configuration
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
 * start build, test and watch, some needed for changedInPlace dryrun
 *
 * @param {function} callback - gulp callback
 */
gulp.task('default', (callback) => {
  sequence('lint',
    'build',
    'test',
    'watch',
    'webserver:init',
    callback);
});

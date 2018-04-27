/**
 * @module build
 */
'use strict';

const gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  changedInPlace = require('gulp-changed-in-place'),
  jscs = require('gulp-jscs'),
  jscsStylish = require('gulp-jscs-stylish'),
  jshint = require('gulp-jshint'),
  jsonlint = require('gulp-jsonlint'),
  less = require('gulp-less'),
  lessChanged = require('gulp-less-changed'),
  lesshint = require('gulp-lesshint'),
  notify = require('gulp-notify'),
  sequence = require('gulp-sequence'),
  rename = require('rename'),
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
   * ### Default gulp build task
   *
   * @task build
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'build': (callback) => {
    /**
     * It is a composite task that runs the following tasks in sequence
     *
     * 1. `build-clean`
     * 2. `build-compile`
     * 3. `build-scripts`
     * 4. `build-stylesheets`
     * 5. `build-assets`
     *
     * The different tasks are found below:
     *
     * @namespace tasks:build
     */
    sequence(
      'jshint',
      'jsonlint',
      'lesshint',
      'less',
      callback
    );
  },
  /**
   * #### Lint js files
   *
   * apply jshint and jscs to js files
   *
   * @task jshint
   * @namespace tasks
   */
  'jshint': () => {
    return gulp.src(paths.forWatch('jshint'))
      .pipe(changedInPlace({ howToDetermineDifference: 'modification-time' }))
      .pipe(jshint())
      .pipe(jscs())
      .pipe(jscsStylish.combineWithHintResults())
      .pipe(jshint.reporter('default'))
//      .pipe(jshint.reporter('jshint-stylish'))
      ;
  },
  /**
   * #### Lint json files
   *
   * apply lesshint json files
   *
   * @task jsonlint
   * @namespace tasks
   */
  'jsonlint': () => {
    return gulp.src(paths.forWatch('jsonlint'))
      .pipe(jsonlint())
      .pipe(jsonlint.reporter())
      ;
  },
  /**
   * #### Lint less files
   *
   * apply lesshint to less files
   *
   * @task lesshint
   * @namespace tasks
   */
  'lesshint': () => {
    return gulp.src(paths.forWatch('lesshint'))
      .pipe(lesshint())
      .on('error', function () {})
      .pipe(lesshint.reporter())
      ;
  },
  /**
   * #### Compile less files
   *
   * compile less files to css
   *
   * @task less
   * @namespace tasks
   */
  'less': () => {
    return gulp.src(paths.for.build.less.src)
      .pipe(lessChanged({
        getOutputFileName: (file) => { // jscs:ignore jsDoc
          return rename(file, { dirname: paths.for.build.less.dest, extname: '.css' });
        }
      }))
      .pipe(less())
      .on('error', log.onError({ message:  'Error: <%= error.message %>', title: 'LESS Error' }))
      .pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
      .pipe(gulp.dest(paths.for.build.less.dest))
      .pipe(log({ message: 'written: <%= file.path %>', title: 'Gulp less' }))
      ;
  }
};

loadTasks.importTasks(tasks);

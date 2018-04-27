/**
 * @module build
 */
'use strict';

const gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  lesshint = require('gulp-lesshint'),
  sequence = require('gulp-sequence'),
  paths = require('./lib/paths'),
  loadTasks = require('./lib/load-tasks')
  ;

const tasks = {
  /**
   * @task build
   * @namespace tasks
   */
  'build' : (callback) => {
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
      'lesshint',
//      'less',
//      'graphviz',
//      'imagemin',
//      'iconfont',
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
    return gulp.src([paths.forWatch('jshint')])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      ;
  },
  /**
   * #### Lint less files
   *
   * apply lesshint less files
   *
   * @task build-clean
   * @namespace tasks
   */
  'lesshint': () => {
    return gulp.src([paths.forWatch('lesshint')])
      .pipe(lesshint())  // enforce style guide
      .on('error', function () {})
      .pipe(lesshint.reporter())
      ;
  }
};

loadTasks.importTasks(tasks);

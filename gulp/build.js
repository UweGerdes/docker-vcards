/**
 * @module build
 */
'use strict';

const gulp = require('gulp'),
  jshint = require('gulp-jshint'),
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
      'lesshint',
      'less',
      'graphviz',
      'imagemin',
      'iconfont',
      'build-jshint',
      callback
    );
  },
  /**
   * #### Cleans the build target folder
   *
   * Cleans the folder, which is the root of the compiled app ( `./.build` )
   *
   * @task build-clean
   * @namespace tasks
   */
  'build-jshint': () => {
    return gulp.src([paths.forSource('build_jshint')])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      ;
  }
};

loadTasks.importTasks(tasks);

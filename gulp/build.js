/**
 * @module build
 */
'use strict';

const gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  jsdoc = require('gulp-jsdoc3'),
  less = require('gulp-less'),
  lessChanged = require('gulp-less-changed'),
  notify = require('gulp-notify'),
  sequence = require('gulp-sequence'),
  rename = require('rename'),
  config = require('../lib/config'),
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
     * Default gulp build task
     *
     * @namespace tasks:build
     */
    sequence(
      'less',
      callback
    );
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
    return gulp.src(config.gulp.build.less.src)
      .pipe(lessChanged({
        getOutputFileName: (file) => { // jscs:ignore jsDoc
          return rename(file, { dirname: config.gulp.build.less.dest, extname: '.css' });
        }
      }))
      .pipe(less())
      .on('error', log.onError({ message:  'Error: <%= error.message %>', title: 'LESS Error' }))
      .pipe(autoprefixer('last 3 version', 'safari 5', 'ie 8', 'ie 9', 'ios 6', 'android 4'))
      .pipe(gulp.dest(config.gulp.build.less.dest))
      .pipe(log({ message: 'written: <%= file.path %>', title: 'Gulp less' }))
      ;
  },
  /**
   * #### Compile jsdoc
   *
   * compile jsdoc
   *
   * @task jsdoc
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'jsdoc': (callback) => {
    const jsdocConfig = {
      'tags': {
        'allowUnknownTags': true
      },
      'opts': {
        'destination': config.gulp.build.jsdoc.dest
      },
      'plugins': [
        'plugins/markdown'
      ],
      'templates': {
        'cleverLinks': false,
        'monospaceLinks': false,
        'default': {
          'outputSourceFiles': true
        },
        'path': 'ink-docstrap',
        'theme': 'cerulean',
        'navType': 'vertical',
        'linenums': true,
        'dateFormat': 'D.MM.YY, HH:mm:ss'
      }
    };
    gulp.src(config.gulp.build.jsdoc.src, { read: false })
      .pipe(jsdoc(jsdocConfig, callback))
      ;
  }
};

loadTasks.importTasks(tasks);

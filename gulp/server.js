/**
 * ## Gulp server tasks
 *
 * @module gulp/server
 */
'use strict';

const gulp = require('gulp'),
  server = require('gulp-develop-server'),
  livereload = require('gulp-livereload'),
  sequence = require('gulp-sequence'),
  config = require('../lib/config'),
  ipv4addresses = require('../lib/ipv4addresses.js'),
  loadTasks = require('./lib/load-tasks'),
  log = require('../lib/log')
  ;

const tasks = {
  /**
   * ### webserver restart and run tests
   *
   * @task webserver
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'webserver': (callback) => {
    sequence(
      'webserver-restart',
      'tests',
      callback
    );
  },
  /**
   * ### webserver livereload task
   *
   * @task livereload
   * @namespace tasks
   */
  'livereload': () => {
    log.info('livereload triggered');
    return gulp.src(config.gulp.watch.livereload)
      .pipe(livereload())
      ;
  },
  /**
   * ### webserver start task
   *
   * @task webserver-start
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'webserver-start': (callback) => {
    server.listen({
        path: config.webserver.server,
        env: { VERBOSE: true, FORCE_COLOR: 1 }
      },
      callback
    );
  },
  /**
   * ### webserver restart task
   *
   * @task webserver-restart
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'webserver-restart': (callback) => {
    server.changed((error) => { // jscs:ignore jsDoc
      if (!error) {
        livereload.changed({ path: '/', quiet: true });
      }
      callback();
    });
  },
  /**
   * ### webserver livereload start task
   *
   * @task livereload-start
   * @namespace tasks
   */
  'livereload-start': () => {
    livereload.listen({ port: config.webserver.livereloadPort, delay: 2000, quiet: true });
    log.info('livereload listening on http://' +
      ipv4addresses.get()[0] + ':' + config.webserver.livereloadPort);
  }
};

loadTasks.importTasks(tasks);

/**
 * @module server
 */
'use strict';

const gulp = require('gulp'),
  server = require('gulp-develop-server'),
  livereload = require('gulp-livereload'),
  sequence = require('gulp-sequence'),
  config = require('../lib/config').config,
  ipv4addresses = require('../lib/ipv4addresses.js'),
  loadTasks = require('./lib/load-tasks'),
  log = require('../lib/log')
  ;

/**
 * ### Overview
 *
 * Register watch tasks for all configured files
 *
 * @namespace tasks
 */
const tasks = {
  /**
   * #### webserver init task
   *
   * start livereload, webserver and postmortem
   *
   * @task webserver:init
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'webserver:init': (callback) => {
    sequence('webserver:livereload:start',
      'webserver:start',
      callback);
  },
  /**
   * #### webserver start task
   *
   * @task webserver:start
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'webserver:start': (callback) => {
    server.listen({
        path: config.webserver.server,
        env: { VERBOSE: true, FORCE_COLOR: 1 }
      },
      callback
    );
  },
  /**
   * #### webserver restart task
   *
   * @task webserver:restart
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'webserver:restart': (callback) => {
    server.changed((error) => { // jscs:ignore jsDoc
      if (!error) {
        livereload.changed({ path: '/', quiet: true });
      }
      callback();
    });
  },
  /**
   * #### webserver livereload start task
   *
   * @task webserver:livereload:start
   * @namespace tasks
   */
  'webserver:livereload:start': () => {
    livereload.listen({ port: config.webserver.livereloadPort, delay: 2000, quiet: true });
    log.info('livereload listening on http://' +
      ipv4addresses.get()[0] + ':' + config.webserver.livereloadPort);
  },
  /**
   * #### webserver livereload task
   *
   * @task webserver:livereload
   * @namespace tasks
   */
  'webserver:livereload': () => {
    log.info('webserver:livereload triggered');
    return gulp.src(config.paths.watch['webserver:livereload'])
      .pipe(livereload())
      ;
  }
};

loadTasks.importTasks(tasks);

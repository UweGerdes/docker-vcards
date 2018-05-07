/**
 * @module server: webserver and livereload
 */
'use strict';

const gulp = require('gulp'),
  server = require('gulp-develop-server'),
  livereload = require('gulp-livereload'),
  config = require('./lib/config'),
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
   * #### webserver restart task
   *
   * @task webserver:restart
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'webserver': (callback) => {
    server.changed((error) => { // jscs:ignore jsDoc
      if (!error) {
        livereload.changed({ path: '/', quiet: true });
      }
      callback();
    });
  },
  /**
   * #### webserver livereload task
   *
   * @task webserver:livereload
   * @namespace tasks
   */
  'livereload': () => {
    log.info('livereload triggered');
    return gulp.src(config.gulp.watch.livereload)
      .pipe(livereload())
      ;
  },
  /**
   * #### webserver start task
   *
   * @task webserver:start
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
   * #### webserver livereload start task
   *
   * @task webserver:livereload:start
   * @namespace tasks
   */
  'livereload-start': () => {
    livereload.listen({ port: config.webserver.livereloadPort, delay: 2000, quiet: true });
    log.info('livereload listening on http://' +
      ipv4addresses.get()[0] + ':' + config.webserver.livereloadPort);
  }
};

loadTasks.importTasks(tasks);

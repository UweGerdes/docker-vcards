/**
 * @module server
 */
'use strict';

const dateFormat = require('dateformat'),
  gulp = require('gulp'),
  server = require('gulp-develop-server'),
  livereload = require('gulp-livereload'),
  sequence = require('gulp-sequence'),
  config = require('../lib/config').config,
  ipv4addresses = require('./lib/ipv4addresses.js'),
  loadTasks = require('./lib/load-tasks')
  ;

function log(msg) { // jscs:ignore jsDoc
  console.log('[' + dateFormat(new Date(), 'HH:MM:ss') + '] ' + msg);
}

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
        env: { VERBOSE: true }
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
      if (error) {
        log('server.js restart error: ' + JSON.stringify(error, null, 4));
      } else {
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
    livereload.listen({ port: config.webserver.livereloadPort, delay: 2000 });
    log('livereload listening on http://' +
      ipv4addresses.get()[0] + ':' + config.webserver.livereloadPort);
  },
  /**
   * #### webserver livereload task
   *
   * @task webserver:livereload
   * @namespace tasks
   */
  'webserver:livereload': () => {
    log('webserver:livereload started');
    return gulp.src(config.paths.watch['webserver:livereload'])
      .pipe(livereload({ quiet: true }))
      ;
  }
};

loadTasks.importTasks(tasks);

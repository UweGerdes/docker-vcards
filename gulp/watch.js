/**
 * @module watch
 */
'use strict';

const gulp = require( 'gulp' ),
  paths = require('./lib/paths'),
  loadTasks = require('./lib/load-tasks')
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
   * @task watch
   * @namespace tasks
   */
  'watch-dev' : function() {
    /**
     * Will watch and execute tasks when files changed in these folders
     */

    for (let task in paths.for.source) {
      if (paths.for.source.hasOwnProperty(task)) {
        if (gulp.task(task)) {
          console.log('Task "' + task + '" is watching: ' + paths.for.source[task]);
        }
      }
    }
    gulp.watch( [ paths.forSource( 'build_jshint' ) ], ["build-jshint"] );
  }
};

loadTasks.importTasks( tasks );

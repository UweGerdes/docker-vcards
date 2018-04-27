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
    const tasks = loadTasks.tasks();
    for (let task in paths.for.watch) {
      if (paths.for.watch.hasOwnProperty(task)) {
        if (tasks.indexOf(task) >= 0) {
          gulp.watch( [ paths.forWatch(task) ], [task] );
          console.log('Task "' + task + '" is watching: ' + paths.for.watch[task]);
        }
      }
    }
  }
};

loadTasks.importTasks( tasks );

/**
 * @module lib:helpers
 * @private
 */
'use strict';

const gulp = require('gulp');
let list = [];

module.exports = {
    /**
     * Import tasks provided as an object into gulp
     *
     * @param tasks {object}
     */
    importTasks : (tasks) => {
        Object
          .keys(tasks)
          .forEach((task) => {
            gulp.task(task, tasks[task]);
            list.push(task);
          });
    },
    /**
     * get the task list
     *
     * @param tasks {object}
     */
    tasks : () => {
        return list;
    }
};

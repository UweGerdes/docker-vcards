/**
 * @module lib:helpers
 * @private
 */
'use strict';

const gulp = require('gulp');

module.exports = {
    /**
     * Import tasks provided as an object into gulp
     *
     * @param tasks {object}
     */
    importTasks : (tasks) => {
        Object
          .keys(tasks)
          .forEach((key) => {
            gulp.task(key, tasks[key]);
          });
    }
};

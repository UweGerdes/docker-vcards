/**
 * ## Gulp test tasks
 *
 * @module gulp/test
 */
'use strict';

const fs = require('fs'),
  glob = require('glob'),
  gulp = require('gulp'),
  mocha = require('gulp-mocha'),
  sequence = require('gulp-sequence'),
  config = require('../lib/config'),
  loadTasks = require('./lib/load-tasks')
  ;

// execute only one test file if one has changed in recentTime, otherwise all
const recentTime = 60; // * 60;

const tasks = {
  /**
   * ### test
   *
   * @task test
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'tests': (callback) => {
    sequence(
      'test-vcards',
      callback
    );
  },
  /**
   * ### test-vcards
   *
   * @task test-vcards
   * @namespace tasks
   * @param {function} callback - gulp callback
   */
  'test-vcards': [['jshint'], (callback) => {
      Promise.all(config.gulp.tests.vcards.map(getFilenames))
      .then((filenames) => [].concat(...filenames)) // jscs:ignore jsDoc
      .then(getRecentFiles)
      .then((filenames) => { // jscs:ignore jsDoc
        const self = gulp.src(filenames, { read: false })
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({ reporter: 'tap', timeout: 4000 })) // timeout for Raspberry Pi 3
        .on('error', function () { // jscs:ignore jsDoc
          self.emit('end');
        });
        return self;
      })
      .then(() => { // jscs:ignore jsDoc
        callback();
      })
      .catch(err => console.log(err)) // jscs:ignore jsDoc
      ;

    }
  ],
};

/**
 * get list of files for glob pattern
 *
 * @private
 * @param {function} path - patterns for paths
 */
const getFilenames = (path) => {
  return new Promise((resolve, reject) => { // jscs:ignore jsDoc
    glob(path, (error, files) => { // jscs:ignore jsDoc
      if (error) {
        reject(error);
      } else {
        resolve(files);
      }
    });
  });
};

/**
 * get newest file from glob list - synchronous
 *
 * @param {array} files - list with glob paths
 */
function getRecentFiles(files) {
  let newest = null;
  let bestTime = 0;
  for (let i = 0; i < files.length; i++) {
    const fileTime = fs.statSync(files[i]).mtime.getTime();
    if (fileTime > bestTime) {
      newest = files[i];
      bestTime = fileTime;
    }
  }
  const now = new Date();
  if (now.getTime() - bestTime < recentTime * 1000) {
    return new Promise((resolve) => { // jscs:ignore jsDoc
      resolve([newest]);
    });
  } else {
    return new Promise((resolve) => { // jscs:ignore jsDoc
      resolve(files);
    });
  }
}

if (process.env.NODE_ENV == 'development') {
  loadTasks.importTasks(tasks);
}

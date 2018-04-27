/*
 * gulpfile for webserver-nodejs
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */
 /**
 *
 * ### Overview
 *
 * We are using [gulp](http://gulpjs.com/) as a build system. Gulp in
 * MyAwesomeProject is responsible for a couple of things :
 *
 * 1. Compiles the project ( written in TypeScript ) to Javascript ;
 * 2. Helps during the development by watching for changes and
 *    compiles automatically.
 *
 * ### Structure
 *
 * Our gulp configuration starts in the root `./gulpfile.js`, which
 * loads all tasks in the directory `./gulp`.
 *
 * The gulp-task files itself are written according to JSDoc specs
 * to make generating the future documentation flawless.
 *
 * There is another special directory, called `./gulp/lib`, which
 * purpose is to store all non-gulptask files that have helpers
 * for the tasks ( e.g. configuration options )
 *
 * ### External Configuration
 *
 * Gulp uses configuration variables stored in `./configuration.yaml`
 *
 * @name gulp
 * @module
 *
 */

// require( "./gulp/development" );
require( ".../../gulp/build" );
// ... more, such as "./gulp/package", "./gulp/deploy", etc.

'use strict';

const glob = require('glob'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	gulpLivereload = require('gulp-livereload'),
	path = require('path'),
	postMortem = require('gulp-postmortem'),
	os = require('os'),
	runSequence = require('run-sequence'),
	server = require('gulp-develop-server')
	;

const baseDir = __dirname;
const htdocsDir = path.join(baseDir, 'htdocs');
let watchFilesFor = {};
const lifereloadPort = process.env.LIVERELOAD_PORT || 8081;
const exitCode = 0;

// start webserver server
gulp.task('webserver:start', function() {
	server.listen({
			path: path.join(baseDir, 'server.js'),
			env: { LIVERELOAD_PORT: lifereloadPort, VERBOSE: false },
			cwd: baseDir
		}
	);
});
gulp.task('webserver:stop', function() {
    server.kill();
});
// restart webserver if server.js changed
watchFilesFor.webserver = [
	path.join(baseDir, 'server.js')
];
gulp.task('webserver', function() {
	server.changed(function(error) {
		if( error ) {
			console.log('webserver server.js restart error: ' + JSON.stringify(error, null, 4));
		} else {
			console.log('webserver server.js restarted');
		}
	});
});
/*
 * gulp postmortem task to stop server on termination of gulp
 */
gulp.task('webserver:postMortem', function() {
	return gulp.src(watchFilesFor.webserver)
		.pipe(postMortem({gulp: gulp, tasks: [ 'webserver:stop' ]}))
		;
});

/*
 * livereload server and task
 */
watchFilesFor.livereload = [
//	path.join(baseDir, 'views', '*.ejs'),
	path.join(htdocsDir, 'css', '*.css'),
	path.join(htdocsDir, '**', '*.html')
];
gulp.task('livereload', function() {
	gulp.src(watchFilesFor.livereload)
//		.pipe(changed(path.dirname('<%= file.path %>')))
//		.pipe(log({ message: 'livereload: <%= file.path %>', title: 'Gulp livereload' }))
		.pipe(gulpLivereload( { quiet: true } ));
});

/*
 * run all build tasks
 */
gulp.task('build1', function(callback) {
		runSequence('lint',
		callback);
});

/*
 * watch task
 */
gulp.task('watch', function() {
	Object.keys(watchFilesFor).forEach(function(task) {
		watchFilesFor[task].forEach(function(filename) {
			glob(filename, function(err, files) {
				if (err) {
					console.log(filename + ' error: ' + JSON.stringify(err, null, 4));
				}
				if (files.length === 0) {
					console.log(filename + ' not found');
				}
			});
		});
		gulp.watch( watchFilesFor[task], [ task ] );
	});
	gulpLivereload.listen( { port: lifereloadPort, delay: 2000 } );
	console.log('gulp livereload listening on http://' + ipv4adresses()[0] + ':' + lifereloadPort);
});

/*
 * init task: start server
 */
gulp.task('webserver:init', function(callback) {
	runSequence('webserver:start',
		'webserver:postMortem',
		callback);
});

/*
 * default task: run all build tasks and watch
 */
gulp.task('default', function(callback) {
	runSequence('build',
		'watch',
		'webserver:init',
		callback);
});

process.on('exit', function () {
	process.exit(exitCode);
});

function ipv4adresses() {
  const addresses = [];
  const interfaces = os.networkInterfaces();
  for (let k in interfaces) {
    if (interfaces.hasOwnProperty(k)) {
      for (let k2 in interfaces[k]) {
        if (interfaces[k].hasOwnProperty(k2)) {
          const address = interfaces[k][k2];
          if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
          }
        }
      }
    }
  }
  return addresses;
}

module.exports = {
	gulp: gulp,
	watchFilesFor: watchFilesFor
};
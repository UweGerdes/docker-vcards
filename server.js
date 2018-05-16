/*
 * HTTP-Server for compare-layouts
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */
'use strict';

const bodyParser = require('body-parser'),
  chalk = require('chalk'),
  dateFormat = require('dateformat'),
  express = require('express'),
  morgan = require('morgan'),
  path = require('path'),
  config = require('./lib/config'),
  ipv4addresses = require('./lib/ipv4addresses'),
  log = require('./lib/log'),
  vcardsRoutes = require('./modules/vcards/routes'),
  app = express()
  ;

const httpPort = config.webserver.httpPort,
  livereloadPort = config.webserver.livereloadPort,
  docRoot = config.webserver.docroot,
  modulesRoot = config.webserver.modules,
  verbose = config.webserver.verbose || false
  ;

/**
 * Weberver logging
 *
 * using log format starting with [time]
 */
if (verbose) {
  morgan.token('time', () => { // jscs:ignore jsDoc
    return dateFormat(new Date(), 'HH:MM:ss');
  });
  app.use(morgan('[' + chalk.gray(':time') + '] ' +
    ':method :status :url :res[content-length] Bytes - :response-time ms'));
}

// no subdirectory for views
app.set('views', __dirname);

// render html files
app.set('view engine', 'ejs');

// work on post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(docRoot));

// Serve modules
app.use('/vcards', vcardsRoutes);

/**
 * Route for root dir
 *
 * @param {Object} req - request
 * @param {Object} res - response
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(docRoot, 'index.html'));
});

/**
 * Route for app main page
 *
 * @param {Object} req - request
 * @param {Object} res - response
 */
app.get('/app', (req, res) => {
  res.render(viewPath('app'), {
    hostname: req.hostname,
    livereloadPort: livereloadPort,
    httpPort: httpPort
  });
});

/**
 * Route for everything else
 *
 * @param {Object} req - request
 * @param {Object} res - response
 */
app.get('*', (req, res) => {
  res.status(404).render(viewPath('404'), {
    hostname: req.hostname,
    livereloadPort: livereloadPort,
    httpPort: httpPort
  });
});

// Fire it up!
log.info('webserver listening on ' +
  chalk.greenBright('http://' + ipv4addresses.get()[0] + ':' + httpPort));

app.listen(httpPort);

/**
 * handle server errors
 *
 * @param {Object} err - error
 * @param {Object} req - request
 * @param {Object} res - response
 */
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500)
    .render(viewPath('500'), {
      error: err,
      hostname: req.hostname,
      livereloadPort: livereloadPort,
      httpPort: httpPort
    }
  );
});

/**
 * get the path for file to render
 *
 * @param {String} page - page type
 * @param {String} type - file type (ejs, TODO jade, pug, html)
 */
function viewPath(page = '404', type = 'ejs') {
  return modulesRoot + '/pages/' + page + '/views/index.' + type;
}

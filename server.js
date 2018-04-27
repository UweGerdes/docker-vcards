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
  config = require('./lib/config').config,
  ipv4addresses = require('./lib/ipv4addresses.js'),
  log = require('./lib/log'),
  app = express();

const httpPort = config.webserver.httpPort,
  docRoot = config.webserver.docroot;

/**
 * Weberver logging
 *
 * using log format starting with [time]
 */
if (process.env.VERBOSE !== 'false') {
  morgan.token('time', () => { // jscs:ignore jsDoc
    return dateFormat(new Date(), 'HH:MM:ss');
  });
  app.use(morgan('[' + chalk.gray(':time') + '] ' +
    ':method :status :url :res[content-length] - :response-time ms'));
}

// work on post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(docRoot));

/**
 * Route for root dir
 *
 * @param {Object} req - request
 * @param {Object} res - result
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(docRoot, 'index.html'));
});

/**
 * Route for everything else.
 *
 * @param {Object} req - request
 * @param {Object} res - result
 */
app.get('*', (req, res) => {
  res.status(404).send('Sorry cant find that: ' + req.url);
});

// Fire it up!
log.info('webserver listening on ' +
  chalk.greenBright('http://' + ipv4addresses.get()[0] + ':' + httpPort));
app.listen(httpPort);

// Model //
/**
 * get list of configurations and result status
 */
/*
function getList() {
  configs = [];
  fs.readdirSync(configDir).forEach((fileName) => { // jscs:ignore jsDoc
    const configName = fileName.replace(/\.js/, '');
    configs.push(getItem(configName));
  });
  configs.forEach((config) => { // jscs:ignore jsDoc
    config.result = getResult(config.data.destDir);
    getSummary(config);
  });
  return configs;
}
*/

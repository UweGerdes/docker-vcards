/*
 * Start a node.js webserver
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */
'use strict';

const bodyParser = require('body-parser'),
	express = require('express'),
	logger = require('morgan'),
	os = require('os'),
	path = require('path');

const app = express();

const httpPort = process.env.SERVER_HTTP || 8080,
	verbose = (process.env.VERBOSE == 'true'),
	baseDir = __dirname;

const htdocsDir = path.join(baseDir, 'htdocs');

// Log the requests
if (verbose) {
	app.use(logger('dev'));
}

// work on post requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files
app.use(express.static(htdocsDir));

// Route for root dir
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for everything else.
app.get('*', function(req, res){
	res.status(404).send('Sorry cant find that: ' + req.url);
});

// Fire it up!
const addresses = ipv4adresses();
// console.log("IP address of container  :  " + addresses);
console.log('webserver listening on http://' + addresses[0] + ':' + httpPort);
app.listen(httpPort);

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

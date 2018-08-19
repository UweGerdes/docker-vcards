/*
 * default configuration for responsive-check
 */

const server = 'vcards-dev:8080'
/*
 * TODO:
const resultStyles = 'body{background-color:#666666}';
const hover = "#submit";
const focus = "[name=input-name]";
const whitelist = 'www.uwegerdes.de'; // allow load from uri with this substring
const blacklist = '.js'; // do not load - even if it comes from whitelist
const credentials = [ 'username', 'pass' + 'word' ];
const viewport.userAgent.phantomjs = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
 '(KHTML, like Gecko) Ubuntu Chromium/65.0.3325.181 Chrome/65.0.3325.181 Safari/537.36';
 */

module.exports = {
  url: 'http://' + server + '/vcards/index.html',
  selector: 'body',
  engines: ['phantomjs', 'slimerjs'],
  viewports: [
    {
      'name': 'smartphone-portrait',
      'viewport': { width: 320, height: 480 }
    },
    {
      'name': 'desktop-standard',
      'viewport': { width: 1280, height: 1024 }
    }
  ]
}

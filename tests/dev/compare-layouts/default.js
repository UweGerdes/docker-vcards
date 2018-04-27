/**
 * default configuration for compare-layouts
 */

const slimerjs = 'slimerjs';
const phantomjs = 'phantomjs';
const server = 'http://webserver:8080/';

module.exports = {
  destDir: 'default',
  viewports: {
    'iPhone-5':        { width:  320, height:  568 },
    'iPhone-6':        { width:  375, height:  667 },
    'Galaxy-S5':       { width:  360, height:  640 },
    'Tablet-Portrait': { width:  768, height: 1024 },
    'Desktop':         { width: 1280, height: 1024 }
  },
  pages: {
    'index-phantomjs': {
      'url': server,
      'selector': 'body',
      'engine': phantomjs,
      'cache': false
    },
    'index-slimerjs': {
      'url': server,
      'selector': 'body',
      'engine': slimerjs,
      'cache': false
    }
  },
  compares: {
    'index-phantomjs-cached-phantomjs': {
      compare: ['tagName', 'type', 'textContent', 'name', 'value'],
      page1: 'index-slimerjs',
      page2: 'index-phantomjs',
      showHTML: true
    }
  }
};

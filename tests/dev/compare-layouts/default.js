/**
 * default configuration for compare-layouts
 */

const url = 'http://webserver:8080/';

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
    'index-phantomjs-cached': {
      'url': url,
      'selector': 'body',
      'engine': 'phantomjs',
      'cache': true
    },
    'index-phantomjs': {
      'url': url,
      'selector': 'body',
      'engine': 'phantomjs',
      'cache': false
    },
    'index-slimerjs': {
      'url': url,
      'selector': 'body',
      'engine': 'slimerjs',
      'cache': false
    }
  },
  compares: {
    'index-phantomjs-cached-phantomjs': {
      compare: ['tagName', 'type', 'textContent', 'name', 'value'],
      page1: 'index-phantomjs-cached',
      page2: 'index-phantomjs',
      showHTML: true
    },
    'index-phantomjs-slimerjs': {
      compare: ['tagName', 'type', 'textContent', 'name', 'value'],
      page1: 'index-phantomjs',
      page2: 'index-slimerjs',
      showHTML: true
    }
  }
};

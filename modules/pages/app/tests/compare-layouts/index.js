/**
 * test app page
 */

const url = 'http://webserver:8080/app';

module.exports = {
  module: 'pages/app',
  label: 'index',
  destDir: 'pages/app/index',
  viewports: {
    'iPhone-5':        { width:  320, height:  568 },
    'iPhone-6':        { width:  375, height:  667 },
    'Galaxy-S5':       { width:  360, height:  640 },
    'Tablet-Portrait': { width:  768, height: 1024 },
    'Desktop':         { width: 1280, height: 1024 }
  },
  pages: {
    'app-phantomjs-cached': {
      'url': url,
      'selector': 'body',
      'engine': 'phantomjs',
      'cache': true
    },
    'app-phantomjs': {
      'url': url,
      'selector': 'body',
      'engine': 'phantomjs',
      'cache': false
    },
    'app-slimerjs': {
      'url': url,
      'selector': 'body',
      'engine': 'slimerjs',
      'cache': false
    }
  },
  compares: {
    'app-phantomjs-cached-phantomjs': {
      compare: ['tagName', 'type', 'textContent', 'name', 'value'],
      page1: 'app-phantomjs-cached',
      page2: 'app-phantomjs',
      showHTML: true
    },
    'app-phantomjs-slimerjs': {
      compare: ['tagName', 'type', 'textContent', 'name', 'value'],
      page1: 'app-phantomjs',
      page2: 'app-slimerjs',
      showHTML: true
    }
  }
};

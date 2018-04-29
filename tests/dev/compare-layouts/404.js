/**
 * test 404 page
 */

const url = 'http://webserver:8080/invalid-path';

module.exports = {
  destDir: '404',
  viewports: {
    'iPhone-5':        { width:  320, height:  568 },
    'iPhone-6':        { width:  375, height:  667 },
    'Galaxy-S5':       { width:  360, height:  640 },
    'Tablet-Portrait': { width:  768, height: 1024 },
    'Desktop':         { width: 1280, height: 1024 }
  },
  pages: {
    '404-phantomjs-cached': {
      'url': url,
      'selector': 'body',
      'engine': 'phantomjs',
      'cache': true
    },
    '404-phantomjs': {
      'url': url,
      'selector': 'body',
      'engine': 'phantomjs',
      'cache': false
    },
    '404-slimerjs': {
      'url': url,
      'selector': 'body',
      'engine': 'slimerjs',
      'cache': false
    }
  },
  compares: {
    '404-phantomjs-cached-phantomjs': {
      compare: ['tagName', 'type', 'textContent', 'name', 'value'],
      page1: '404-phantomjs-cached',
      page2: '404-phantomjs',
      showHTML: true
    },
    '404-phantomjs-slimerjs': {
      compare: ['tagName', 'type', 'textContent', 'name', 'value'],
      page1: '404-phantomjs',
      page2: '404-slimerjs',
      showHTML: true
    }
  }
};

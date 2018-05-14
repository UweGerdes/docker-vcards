/**
 * Test for vCard search
 */
'use strict';

/* jshint expr: true, mocha: true, browser: true */

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom
  ;

chai.use(chaiHttp);

describe('vcard page', function () {
  describe('GET /vcards/', function () {
    it('should have head', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const searchButton = document.getElementById('searchButton');
          assert.equal(searchButton.textContent, 'suchen');
          assert.equal(searchButton.getAttribute('class'), 'button searchButton');
          assert.equal(searchButton.getAttribute('data-toggle'), 'searchLayer');
          done();
        });
    });
    /*
    it('should have other things', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/')
        .end(function (err, res) {
          const { document } = (new JSDOM(res.text)).window;
          assert.equal(document.title, 'Webserver - vcard');
          assert.equal(document.head.getElementsByTagName('link').length, 1);
          assert.equal(
            document.head.getElementsByTagName('link')[0].attributes.href.nodeValue,
            '/css/app.css');
          const footer = document.getElementById('footer');
          assert.equal(footer.textContent, '© 2018 Uwe Gerdes');
          assert.equal(
            document.body.getElementsByTagName('script')[0].attributes.src.nodeValue,
            'http://172.25.0.2:8081/livereload.js');
          done();
        });
    });
    */
  });
});

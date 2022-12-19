/**
 * Test for vCard page elements
 */

'use strict';

/* jshint expr: true, mocha: true, browser: true */

const chai = require('chai'),
  chaiHttp = require('chai-http'),
  jsdom = require('jsdom'),
  assert = chai.assert,
  expect = chai.expect,
  { JSDOM } = jsdom;
chai.use(chaiHttp);

const url = 'http://0.0.0.0:8080';

describe('tests/server/page', function () {
  describe('GET /vcards/dataset/testdata', function () {
    it('should reset dataset to testdada and have head', function (done) {
      chai.request(url)
        .get('/vcards/dataset/testdata')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          assert.equal(document.title, 'VCard Editor');
          assert.equal(document.head.getElementsByTagName('link').length, 2);
          assert.equal(
            document.head.getElementsByTagName('link')[0].attributes.href.nodeValue,
            '/app.css'
          );
          done();
        });
    });
  });
  describe('GET /vcards/', function () {
    it('should have some buttons', function (done) {
      chai.request(url)
        .get('/vcards/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const searchButton = document.getElementById('searchButton');
          assert.equal(searchButton.textContent, 'suchen');
          assert.equal(searchButton.getAttribute('class'), 'button searchButton');
          assert.equal(searchButton.getAttribute('data-modal'), '#searchLayer');
          const downloadButton = document.getElementById('downloadButton');
          assert.equal(downloadButton.textContent, 'speichern...');
          assert.equal(downloadButton.getAttribute('class'), 'button downloadButton');
          assert.equal(downloadButton.getAttribute('data-open-url'), '/vcards/download/');
          done();
        });
    });
    it('should have footer', function (done) {
      chai.request(url)
        .get('/vcards/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const footer = document.getElementById('footer');
          assert.equal(footer.textContent, '© 2019 Uwe Gerdes');
          done();
        });
    });
    it('should have a list', function (done) {
      chai.request(url)
        .get('/vcards/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'Uwe Gerdes');
          assert.equal(
            list[0].getElementsByTagName('a')[0].attributes.href.nodeValue,
            '/vcards/0/'
          );
          assert.equal(list[1].textContent, 'Uwe Gerdes');
          assert.equal(
            list[1].getElementsByTagName('a')[0].attributes.href.nodeValue,
            '/vcards/1/'
          );
          done();
        });
    });
  });
  describe('GET /vcards/sort/email', function () {
    it('should have a email sorted list', function (done) {
      chai.request(url)
        .get('/vcards/sort/email')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'Uwe Gerdes');
          assert.equal(
            list[0].getElementsByTagName('a')[0].attributes.href.nodeValue,
            '/vcards/1/'
          );
          assert.equal(list[1].textContent, 'Uwe Gerdes');
          assert.equal(
            list[1].getElementsByTagName('a')[0].attributes.href.nodeValue,
            '/vcards/0/'
          );
          done();
        });
    });
  });
  describe('GET /vcards/0', function () {
    it('should have a version sorted list', function (done) {
      chai.request(url)
        .get('/vcards/0')
        .set('Cookie', 'sort=version')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'Uwe Gerdes');
          assert.equal(
            list[0].getElementsByTagName('a')[0].attributes.href.nodeValue,
            '/vcards/0/'
          );
          assert.equal(list[1].textContent, 'Uwe Gerdes');
          assert.equal(
            list[1].getElementsByTagName('a')[0].attributes.href.nodeValue,
            '/vcards/1/'
          );
          done();
        });
    });
  });
});

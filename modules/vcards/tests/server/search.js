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

describe('vcard search', function () {
  let oldDatasetName;
  before(function (done) {
    chai.request('http://172.25.0.2:8080')
    .get('/vcards/dataset/testdata')
    .end(function (err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.html;
      const { document } = (new JSDOM(res.text)).window;
      const headline = document.getElementById('headline');
      assert.equal(headline.textContent, 'vcard');
      const list = document.getElementById('list').getElementsByTagName('li');
      assert.equal(list.length, 2);
      assert.equal(list[0].textContent, 'Gerdes, Uwe');
      assert.equal(list[1].textContent, 'Gerdes, Uwe');
      done();
    });
  });
  after(function (done) {
    let resetName = 'testdata';
    if (oldDatasetName) {
      resetName = oldDatasetName;
      console.log('reset to:', oldDatasetName);
    }
    chai.request('http://172.25.0.2:8080')
    .get('/vcards/dataset/' + resetName)
    .end(function (err, res) {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res).to.be.html;
      const { document } = (new JSDOM(res.text)).window;
      const headline = document.getElementById('headline');
      assert.equal(headline.textContent, 'vcard');
      const list = document.getElementById('list').getElementsByTagName('li');
      assert.equal(list.length, 2);
      assert.equal(list[0].textContent, 'Gerdes, Uwe');
      assert.equal(list[1].textContent, 'Gerdes, Uwe');
      done();
    });
  });
  describe('GET /vcards/', function () {
    it('should have search form', function (done) {
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
          assert.equal(searchButton.getAttribute('data-toggle'), '#searchLayer');
          const searchLayer = document.getElementById('searchLayer');
          assert.equal(searchLayer.getAttribute('class'), 'searchLayer hidden');
          const searchInfo = document.getElementById('searchInfo');
          assert.equal(searchInfo.getAttribute('class'), 'searchInfo');
          assert.equal(searchInfo.textContent, '');
          done();
        });
    });
  });
  describe('POST /vcards/search/', function () {
    it('should find two names with "e"', function (done) {
      chai.request('http://172.25.0.2:8080')
        .post('/vcards/search/')
        .type('form')
        .send({
          searchFields: 'n',
          searchString: 'e'
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'Gerdes, Uweöffnen');
          assert.equal(list[1].textContent, 'Gerdes, Uweöffnenmerge');
          done();
        });
    });
    it('should find one version with "2" - link should be "/vcards/0/"', function (done) {
      chai.request('http://172.25.0.2:8080')
        .post('/vcards/search/')
        .type('form')
        .send({
          searchFields: 'version',
          searchString: '2'
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const list = document.getElementById('list').getElementsByTagName('a');
          assert.equal(list.length, 1);
          assert.equal(list[0].textContent, 'öffnen');
          assert.equal(list[0].attributes.href.nodeValue, '/vcards/0/');
          done();
        });
    });
    it('should find one version with "3" - link should be "/vcards/1/"', function (done) {
      chai.request('http://172.25.0.2:8080')
        .post('/vcards/search/0')
        .type('form')
        .send({
          searchFields: 'version',
          searchString: '3'
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const list = document.getElementById('list').getElementsByTagName('a');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'öffnen');
          assert.equal(list[0].attributes.href.nodeValue, '/vcards/1/');
          assert.equal(list[1].textContent, 'merge');
          assert.equal(list[1].attributes.href.nodeValue, '/vcards/merge/0/1/');
          done();
        });
    });
    it('should find no name with value "x"', function (done) {
      chai.request('http://172.25.0.2:8080')
        .post('/vcards/search/')
        .type('form')
        .send({
          searchFields: 'n',
          searchString: 'x'
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 0);
          done();
        });
    });
  });
});

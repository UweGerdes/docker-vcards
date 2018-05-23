/**
 * Test for vCard item view
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

describe('vcard item', function () {
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
      assert.equal(list[0].textContent, 'Uwe Gerdes');
      assert.equal(list[1].textContent, 'Uwe Gerdes');
      const oldDatasetNameElement = document.getElementById('oldDatasetName');
      oldDatasetName = oldDatasetNameElement.textContent;
      done();
    });
  });
  after(function (done) {
    let resetName = 'testdata';
    if (oldDatasetName) {
      resetName = oldDatasetName;
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
      done();
    });
  });
  describe('GET /vcards/', function () {
    it('should list ALL vcards', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'vcard');
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'Uwe Gerdes');
          assert.equal(list[1].textContent, 'Uwe Gerdes');
          done();
        });
    });
  });
  describe('GET /vcards/0/', function () {
    it('should list a SINGLE vcard', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/0/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'vcard Uwe Gerdes');
          const item = document.getElementById('item').getElementsByTagName('li');
          assert.equal(item.length, 8);
          const name = document.getElementById('n');
          assert.equal(name.textContent, 'Name: Gerdes, Uwe');
          const nameParts = name.childNodes[1].childNodes[0].childNodes;
          assert.equal(nameParts.length, 6);
          assert.equal(nameParts[0].textContent, 'Gerdes');
          assert.equal(nameParts[1].textContent, ', ');
          assert.equal(nameParts[2].textContent, 'Uwe');
          assert.equal(document.getElementById('tel').textContent,
            'Telefon: 040 256486 (Arbeit, Sprache)0179 3901008 (Mobil)');
          done();
        });
    });
  });
  describe('GET /vcards/1/', function () {
    it('should list a SINGLE vcard', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/1/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'vcard Uwe Gerdes');
          const item = document.getElementById('item').getElementsByTagName('li');
          assert.equal(item.length, 9);
          assert.equal(document.getElementById('n').textContent, 'Name: Gerdes, Uwe');
          assert.equal(document.getElementById('tel').textContent,
            'Telefon: +49 40 25178252 (Arbeit, Sprache)01793901008 (Mobil)');
          assert.equal(document.getElementById('adr').textContent,
            'Adresse: Klaus-Groth-Str. 22, Hamburg, 20535, Germany (privat)');
          assert.equal(document.getElementById('rev').textContent,
            'Timestamp: 2014-8-24 20:50:00');
          done();
        });
    });
  });
});

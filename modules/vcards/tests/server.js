/**
 * Test for vCard webserver test results
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

describe('vcard server', function () {
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
          assert.equal(list[0].textContent, 'Gerdes, Uwe');
          assert.equal(list[1].textContent, 'Gerdes, Uwe');
          done();
        });
    });
  });
  describe('GET /vcards/0/', function () {
    it('should list list a SINGLE vcard', function (done) {
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
          assert.equal(document.getElementById('n').textContent, 'Name:  Gerdes, Uwe');
          assert.equal(document.getElementById('tel').textContent,
            'Telefon: Arbeit, Sprache: 040 256486Mobil: 0179 3901008');
          done();
        });
    });
  });
  describe('GET /vcards/1/', function () {
    it('should list list a SINGLE vcard', function (done) {
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
          assert.equal(document.getElementById('n').textContent, 'Name:  Gerdes, Uwe');
          assert.equal(document.getElementById('tel').textContent,
            'Telefon: Arbeit, Sprache: +49 40 25178252Mobil: 01793901008');
          assert.equal(document.getElementById('adr').textContent,
            'Adresse: privat: Klaus-Groth-Str. 22, Hamburg, 20535, Germany');
          assert.equal(document.getElementById('rev').textContent,
            'Timestamp:  2014-8-24 20:50:00');
          done();
        });
    });
  });
});

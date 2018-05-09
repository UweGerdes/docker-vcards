/**
 * Test for vCard data model
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
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'Gerdes;Uwe;;;');
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
          assert.equal(res.text, 'vCard get 0');
          /*
          const { document } = (new JSDOM(res.text)).window;
          assert.equal(document.body.innerHTML,
            '<ul id="list"><li>test</li><li>test2</li></ul>');
          assert.equal(document.getElementById('list').childNodes.length, 2);
          console.log('list:', document.getElementById('list').childNodes.length);
          */
          done();
        });
    });
  });
});

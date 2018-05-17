/**
 * Test for vCard edit
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
  describe('GET /vcards/edit/0/', function () {
    it('should list a SINGLE vcard', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/edit/0/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'vcard Uwe Gerdes bearbeiten');
          const item = document.getElementById('item').getElementsByTagName('li');
          assert.equal(item.length, 8);
          assert.equal(document.getElementById('n').textContent, 'Name:  Gerdes, Uwe');
          assert.equal(document.getElementById('tel').textContent,
            'Telefon: Arbeit, Sprache: 040 256486Mobil: 0179 3901008');
          done();
        });
    });
  });
});

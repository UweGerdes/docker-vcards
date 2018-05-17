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

          const form = document.querySelectorAll('form#edit');
          assert.equal(form.length, 1);

          const inputVersion = document.querySelectorAll('form#edit #version');
          assert.equal(inputVersion.length, 1);
          assert.equal(inputVersion[0].getAttribute('size'), 5);
          assert.equal(inputVersion[0].getAttribute('value'), '2.1');

          const inputN = document.querySelectorAll('form#edit #n');
          assert.equal(inputN.length, 1);
          assert.equal(inputN[0].getAttribute('size'), 30);
          assert.equal(inputN[0].getAttribute('value'), 'Gerdes;Uwe;;;');

          done();
        });
    });
  });
});

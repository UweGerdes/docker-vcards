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
  describe('GET /vcards/', function () {
    it('should not have edit button', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const editButton = document.getElementById('editButton');
          assert.equal(editButton, null);
          done();
        });
    });
  });
  describe('GET /vcards/0/', function () {
    it('should have edit button', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/0/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const editButton = document.getElementById('editButton');
          assert.equal(editButton.textContent, 'ändern');
          assert.equal(editButton.getAttribute('class'), 'button editButton');
          assert.equal(editButton.getAttribute('href'), '/vcards/edit/0/');
          done();
        });
    });
  });
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

          const inputTel0 = document.querySelectorAll('form#edit #tel_0');
          assert.equal(inputTel0.length, 1);
          assert.equal(inputTel0[0].getAttribute('size'), 30);
          assert.equal(inputTel0[0].getAttribute('value'), '040 256486');

          const inputTel1 = document.querySelectorAll('form#edit #tel_1');
          assert.equal(inputTel1.length, 1);
          assert.equal(inputTel1[0].getAttribute('size'), 30);
          assert.equal(inputTel1[0].getAttribute('value'), '0179 3901008');

          done();
        });
    });
  });
  describe('GET /vcards/type/tel/_1/work', function () {
    it('should render a type item', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/type/tel/_1/work')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const type = document.querySelectorAll('.type');
          assert.equal(type.length, 1);
          assert.equal(type[0].textContent, 'Arbeit');
          const checkbox = document.querySelectorAll('input[type="checkbox"]');
          assert.equal(checkbox.length, 1);
          assert.equal(checkbox[0].getAttribute('name'), 'tel_1');
          assert.equal(checkbox[0].getAttribute('value'), 'work');
          done();
        });
    });
  });
});

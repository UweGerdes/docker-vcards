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

describe('vcard edit', function () {
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

          const inputTel0 = document.querySelectorAll('form#edit #tel0');
          assert.equal(inputTel0.length, 1);
          assert.equal(inputTel0[0].getAttribute('size'), 30);
          assert.equal(inputTel0[0].getAttribute('value'), '040 256486');

          const inputTel1 = document.querySelectorAll('form#edit #tel1');
          assert.equal(inputTel1.length, 1);
          assert.equal(inputTel1[0].getAttribute('size'), 30);
          assert.equal(inputTel1[0].getAttribute('value'), '0179 3901008');

          done();
        });
    });
  });
  describe('GET /vcards/type/tel/_0/work', function () {
    it('should render a work type for tel0', function (done) {
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
          assert.equal(checkbox[0].getAttribute('name'), 'tel1_type');
          assert.equal(checkbox[0].getAttribute('value'), 'work');
          done();
        });
    });
  });
  describe('GET /vcards/type/tel/_1/work', function () {
    it('should render a work type for tel1', function (done) {
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
          assert.equal(checkbox[0].getAttribute('name'), 'tel1_type');
          assert.equal(checkbox[0].getAttribute('value'), 'work');
          done();
        });
    });
  });
  describe('GET /vcards/type/email/_/work', function () {
    it('should render a work type for email', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/type/email/_/work')
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
          assert.equal(checkbox[0].getAttribute('name'), 'email_type');
          assert.equal(checkbox[0].getAttribute('value'), 'work');
          done();
        });
    });
  });
  describe('GET /vcards/field/email/1', function () {
    it('should render a work type for email', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/field/email/1')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const input = document.querySelectorAll('input[type="text"]');
          assert.equal(input.length, 1);
          assert.equal(input[0].name, 'email1');
          done();
        });
    });
  });
  describe('GET /vcards/edit/0/', function () {
    it('should have select with types for email', function (done) {
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/edit/0/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const types = document.querySelectorAll('input[type="checkbox"][name="email_type"]');
          assert.equal(types.length, 1);
          const selectEmail = document.querySelectorAll('select[name="select_email"]');
          assert.equal(selectEmail.length, 1);
          assert.equal(selectEmail[0].value, '');
          selectEmail[0].selectedIndex = 1;
          assert.equal(selectEmail[0].value, 'work');
          done();
        });
    });
  });
  describe('POST /vcards/save/1', function () {
    it('should save data in model', function (done) {
      chai.request('http://172.25.0.2:8080')
        .post('/vcards/save/1')
        .type('form')
        .send({
          version: '2.1',
          n: 'Gerdes;Uwe;;;',
          fn: 'Uwe Gerdes neu',
          tel0: '040 256486 neu',
          tel0_type: ['work', 'voice'],
          select_tel0: '',
          tel1: '0179 3901008 neu',
          select_tel1: '',
          email: 'uwe@uwegerdes.de neu',
          email_type: 'pref',
          select_email: '',
          select_url: ''
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'vcard Uwe Gerdes neu');
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'Gerdes, Uwe');
          assert.equal(list[1].textContent, 'Gerdes, Uwe');
          done();
        });
    });
    it('should reset data in model', function (done) {
      chai.request('http://172.25.0.2:8080')
        .post('/vcards/save/1')
        .type('form')
        .send({
          version: '3.0',
          n: 'Gerdes;Uwe;;;',
          fn: 'Uwe Gerdes',
          tel0: '040 256486',
          tel0_type: ['work', 'voice'],
          select_tel0: '',
          tel1: '0179 3901008',
          select_tel1: '',
          email: 'uwe@uwegerdes.de',
          email_type: 'pref',
          select_email: '',
          select_url: ''
        })
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'vcard Uwe Gerdes');
          const list = document.getElementById('list').getElementsByTagName('li');
          assert.equal(list.length, 2);
          assert.equal(list[0].textContent, 'Gerdes, Uwe');
          assert.equal(list[1].textContent, 'Gerdes, Uwe');
          done();
        });
    });
  });
});

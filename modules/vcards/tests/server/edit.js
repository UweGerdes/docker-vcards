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
  let oldDatasetName;
  before(function (done) {
    chai.request('http://vcards-dev:8080')
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
    chai.request('http://vcards-dev:8080')
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
    it('should not have edit button', function (done) {
      chai.request('http://vcards-dev:8080')
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
      chai.request('http://vcards-dev:8080')
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
      chai.request('http://vcards-dev:8080')
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
          assert.equal(inputVersion.length, 1, 'input field version');
          assert.equal(inputVersion[0].getAttribute('size'), 5);
          assert.equal(inputVersion[0].getAttribute('value'), '2.1');

          const inputN = document.querySelectorAll('form#edit #n_container .input-text');
          assert.equal(inputN.length, 5, 'input field n');
          assert.equal(inputN[0].getAttribute('title'), 'Vorname');
          assert.equal(inputN[0].getAttribute('value'), 'Uwe');

          const inputTel0 = document.querySelectorAll('form#edit #tel0');
          assert.equal(inputTel0.length, 1, 'input field tel0');
          assert.equal(inputTel0[0].getAttribute('size'), 30);
          assert.equal(inputTel0[0].getAttribute('value'), '040 256486');

          const inputTel1 = document.querySelectorAll('form#edit #tel1');
          assert.equal(inputTel1.length, 1);
          assert.equal(inputTel1[0].getAttribute('size'), 30);
          assert.equal(inputTel1[0].getAttribute('value'), '0179 3901008');

          const inputGroups0 = document.querySelectorAll('form#edit #xGroupMembership0');
          assert.equal(inputGroups0.length, 1, 'input field xGroupMembership0');
          assert.equal(inputGroups0[0].getAttribute('size'), 30);
          assert.equal(inputGroups0[0].getAttribute('value'), 'Ich');

          const inputGroups1 = document.querySelectorAll('form#edit #xGroupMembership1');
          assert.equal(inputGroups1.length, 1, 'input field xGroupMembership1');
          assert.equal(inputGroups1[0].getAttribute('size'), 30);
          assert.equal(inputGroups1[0].getAttribute('value'), 'Uwe');

          done();
        });
    });
  });
  describe('GET /vcards/edit/1/', function () {
    it('should edit vcard with separated fields n, adr', function (done) {
      chai.request('http://vcards-dev:8080')
        .get('/vcards/edit/1/')
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
          assert.equal(inputVersion.length, 1, 'input field version');
          assert.equal(inputVersion[0].getAttribute('size'), 5);
          assert.equal(inputVersion[0].getAttribute('value'), '3.0');

          const inputN = document.querySelectorAll('form#edit #n_container .input-text');
          assert.equal(inputN.length, 5, 'input field n');
          assert.equal(inputN[0].getAttribute('title'), 'Vorname');
          assert.equal(inputN[0].getAttribute('value'), 'Uwe');
          assert.equal(inputN[1].getAttribute('title'), 'Nachname');
          assert.equal(inputN[1].getAttribute('value'), 'Gerdes');

          const inputAdr = document.querySelectorAll('form#edit #adr_container .input-text');
          assert.equal(inputAdr.length, 7, 'input field adr');
          assert.equal(inputAdr[0].getAttribute('title'), 'Straße');
          assert.equal(inputAdr[0].getAttribute('value'), 'Klaus-Groth-Str. 22');
          assert.equal(inputAdr[1].getAttribute('title'), 'PLZ');
          assert.equal(inputAdr[1].getAttribute('value'), '20535');
          assert.equal(inputAdr[2].getAttribute('title'), 'Ort');
          assert.equal(inputAdr[2].getAttribute('value'), 'Hamburg');
          assert.equal(inputAdr[3].getAttribute('title'), 'Land');
          assert.equal(inputAdr[3].getAttribute('value'), 'Germany');

          done();
        });
    });
  });
  describe('GET /vcards/type/tel/_1/work', function () {
    it('should render a work type for tel0', function (done) {
      chai.request('http://vcards-dev:8080')
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
      chai.request('http://vcards-dev:8080')
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
  describe('GET /vcards/type/email/_/work/2', function () {
    it('should render a work type for email', function (done) {
      chai.request('http://vcards-dev:8080')
        .get('/vcards/type/email/_/work/2')
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
          assert.equal(checkbox[0].getAttribute('id'), 'checkbox_email_2');
          assert.equal(checkbox[0].getAttribute('value'), 'work');
          done();
        });
    });
  });
  describe('GET /vcards/field/email/1', function () {
    it('should render a work type for email', function (done) {
      chai.request('http://vcards-dev:8080')
        .get('/vcards/input/email/1')
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
  describe('GET /vcards/field/xGroupMembership/2', function () {
    it('should render a work type for email', function (done) {
      chai.request('http://vcards-dev:8080')
        .get('/vcards/input/xGroupMembership/2')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const input = document.querySelectorAll('input[type="text"]');
          assert.equal(input.length, 1);
          assert.equal(input[0].name, 'xGroupMembership2');
          done();
        });
    });
  });
  describe('GET /vcards/edit/0/', function () {
    it('should have select with types for email', function (done) {
      chai.request('http://vcards-dev:8080')
        .get('/vcards/edit/0/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const types = document.querySelectorAll('input[type="checkbox"][name="email0_type"]');
          assert.equal(types.length, 1);
          const selectEmail = document.querySelectorAll('select[name="select_email0"]');
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
      chai.request('http://vcards-dev:8080')
        .post('/vcards/save/1')
        .type('form')
        .send({
          version: '2.1',
          n_Vorname: 'Uwe Wilhelm',
          n_Nachname: 'Gerdes (test)',
          n_Titel: 'Dipl. Ing. FH',
          fn: 'Uwe Gerdes neu',
          tel0: '040 256486 neu',
          tel0_type: ['work', 'voice'],
          select_tel0: '',
          tel1: '0179 3901008 neu',
          select_tel1: '',
          adr0_Straße: 'Klaus-Groth-Str. 22',
          adr0_PLZ: '20535',
          adr0_Ort: 'Hamburg',
          adr0_Land: 'Germany',
          adr0_type: 'home',
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
          assert.equal(list[0].textContent, 'Uwe Gerdes');
          assert.equal(list[1].textContent, 'Uwe Gerdes neu');
          const name = document.getElementById('n');
          assert.equal(name.textContent, 'Name: Gerdes (test), Uwe Wilhelm, Dipl. Ing. FH');
          const nameParts = name.childNodes[1].childNodes[0].childNodes[0].childNodes;
          assert.equal(nameParts.length, 5);
          assert.equal(nameParts[0].textContent, 'Gerdes (test)');
          assert.equal(nameParts[1].textContent, ', ');
          assert.equal(nameParts[2].textContent, 'Uwe Wilhelm');
          assert.equal(nameParts[3].textContent, ', ');
          assert.equal(nameParts[4].textContent, 'Dipl. Ing. FH');
          const adr = document.getElementById('adr');
          assert.equal(adr.textContent,
              'Adresse: Klaus-Groth-Str. 22, Hamburg, 20535, Germany (privat)');
          const adrParts = adr.getElementsByClassName('parts')[0].childNodes;
          assert.equal(adrParts.length, 8);
          assert.equal(adrParts[0].textContent, 'Klaus-Groth-Str. 22');
          assert.equal(adrParts[1].textContent, ', ');
          assert.equal(adrParts[2].textContent, 'Hamburg');
          assert.equal(adrParts[3].textContent, ', ');
          assert.equal(adrParts[4].textContent, '20535');
          assert.equal(adrParts[5].textContent, ', ');
          assert.equal(adrParts[6].textContent, 'Germany');
          assert.equal(adrParts[7].textContent, ' (privat)');
          done();
        });
    });
    it('should reset data in model', function (done) {
      chai.request('http://vcards-dev:8080')
        .post('/vcards/save/1')
        .type('form')
        .send({
          version: '3.0',
          n_Vorname: 'Uwe',
          n_Nachname: 'Gerdes',
          n_Titel: '',
          fn: 'Uwe Gerdes',
          tel0: '+49 40 25178252',
          tel0_type: ['work', 'voice'],
          select_tel0: '',
          tel1: '01793901008',
          tel1_type: 'cell',
          select_tel1: '',
          adr_Straße: 'Klaus-Groth-Str. 22',
          adr_PLZ: '20535',
          adr_Ort: 'Hamburg',
          adr_Land: 'Germany',
          adr_type: 'home',
          select_adr: '',
          email: 'entwicklung@uwegerdes.de',
          email_type: ['pref', 'internet'],
          select_email: '',
          rev: '2014-08-24T18:50:00Z'
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
          assert.equal(list[0].textContent, 'Uwe Gerdes');
          assert.equal(list[1].textContent, 'Uwe Gerdes');
          done();
        });
    });
  });
  describe('GET /vcards/edit/0/', function () {
    it('should have timestamp and status fields', function (done) {
      chai.request('http://vcards-dev:8080')
        .get('/vcards/edit/0/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const xTimestamp = document.querySelectorAll('input[type="text"][name="xTimestamp"]');
          assert.equal(xTimestamp.length, 1);
          const xStatus = document.querySelectorAll('input[type="text"][name="xStatus"]');
          assert.equal(xStatus.length, 1);
          assert.equal(xStatus[0].getAttribute('value'), 'edit');
          done();
        });
    });
  });
});

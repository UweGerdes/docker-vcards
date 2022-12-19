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
  { JSDOM } = jsdom;
chai.use(chaiHttp);

const url = 'http://0.0.0.0:8080';

describe('tests/server/image', function () {
  let oldDatasetName;
  before(function (done) {
    chai.request(url)
      .get('/vcards/dataset/testimage')
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
    chai.request(url)
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
      chai.request(url)
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
          done();
        });
    });
  });
  describe('GET /vcards/0/', function () {
    it('should list a SINGLE vcard', function (done) {
      chai.request(url)
        .get('/vcards/0/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const headline = document.getElementById('headline');
          assert.equal(headline.textContent, 'vcard Uwe Gerdes');
          const item = document.getElementById('item').getElementsByTagName('li');
          assert.equal(item.length, 9);
          const name = document.getElementById('n');
          assert.equal(name.textContent, 'Name: Gerdes, Uwe');
          const nameParts = name.childNodes[1].childNodes[0].childNodes[0].childNodes;
          assert.equal(nameParts.length, 3);
          assert.equal(nameParts[0].textContent, 'Gerdes');
          assert.equal(nameParts[1].textContent, ', ');
          assert.equal(nameParts[2].textContent, 'Uwe');
          assert.equal(
            document.getElementById('url').textContent,
            'Homepage: http://www.google.com/profiles/108735976046160800643'
          );
          assert.equal(
            document.getElementById('photo').textContent,
            'Foto:  (jpeg)'
          );
          assert.equal(
            document.getElementById('photo').getElementsByTagName('img')[0]
              .getAttribute('src').indexOf('data:image/jpeg;base64,/9j/4AAQSk'),
            0,
            'Foto:  src'
          );
          done();
        });
    });
  });
  describe('GET /vcards/edit/0/', function () {
    it('should have checkbox for image', function (done) {
      chai.request(url)
        .get('/vcards/edit/0/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const photo = document.querySelectorAll('input[type="checkbox"][name="photo"]');
          assert.equal(photo.length, 1, 'checkbox photo');
          const type = document.querySelectorAll('input[type="hidden"][name="photo_type"]');
          assert.equal(type.length, 1, 'hidden photo_type');
          const enc = document.querySelectorAll('input[type="hidden"][name="photo_encoding"]');
          assert.equal(enc.length, 1, 'hidden photo_encoding');
          done();
        });
    });
  });
  describe('GET /vcards/merge/0/1/', function () {
    it('should not have edit button', function (done) {
      chai.request(url)
        .get('/vcards/merge/0/1/')
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
    it('should have fields version, email, photo and many values', function (done) {
      chai.request(url)
        .get('/vcards/merge/0/1/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const form = document.querySelectorAll('form#merge-form')[0];
          assert.equal(form.getAttribute('action'), '/vcards/save/0/1');
          const mergeFieldList =
            document.querySelectorAll('#merge-form .props-list > .props-item .field');
          assert.equal(mergeFieldList.length, 10);
          assert.equal(mergeFieldList[0].childNodes.length, 3);
          assert.equal(mergeFieldList[0].childNodes[0].textContent.trim(), 'Version:');
          assert.equal(mergeFieldList[0].childNodes[1].textContent.trim(), '2.1');
          const email = mergeFieldList[3].childNodes;
          assert.equal(email.length, 3);
          assert.equal(email[0].textContent.trim(), 'E-Mail:');
          assert.equal(email[1].textContent.trim(), 'pinkpighh@googlemail.com (!)');
          assert.equal(email[2].textContent.trim(), 'uwe@uwegerdes.de (!)');
          const photo = mergeFieldList[5].childNodes;
          assert.equal(photo[0].textContent.trim(), 'Foto:');
          let formData = {};
          const fd = new document.defaultView.FormData(form);
          let e = fd.entries();
          for (let current = e.next(); !current.done; current = e.next()) {
            formData[current.value[0]] = current.value[1];
          }
          // console.log(JSON.stringify(formData));
          Object.keys(formDataCompare).forEach(key => { // jscs:ignore jsDoc
            assert.equal(
              formData[key],
              formDataCompare[key],
              formData[key] + ' == ' + formDataCompare[key]
            );
          });
          assert.equal(formData.photo.indexOf('/9j/4AAQSkZJRgABA'), 0, 'photo data start');
          done();
        });
    });
  });
});

const formDataCompare = {
  'version': '2.1',
  'fn': 'Uwe Gerdes',
  'email10': 'pinkpighh@googlemail.com',
  'email10_type': 'pref',
  'email20': 'uwe@uwegerdes.de',
  'email20_type': 'pref',
  'url': 'http://www.google.com/profiles/108735976046160800643',
  'xGroupMembership10': 'My Contacts',
  'tel20': '040 256486',
  'tel20_type': 'voice',
  'tel21': '0179 3901008',
  'tel21_type': 'cell'
};

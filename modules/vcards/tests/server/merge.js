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

describe('vcard merge', function () {
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
  describe('GET /vcards/merge/0/1/', function () {
    it('should not have edit button', function (done) {
      chai.request('http://vcards-dev:8080')
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
    it('should have version field with two values', function (done) {
      chai.request('http://vcards-dev:8080')
        .get('/vcards/merge/0/1/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const form = document.querySelectorAll('form#merge')[0];
          assert.equal(form.getAttribute('action'), '/vcards/save/0/1');
          const mergeFieldList = document.querySelectorAll('#mergeView #fieldList > .list-item');
          assert.equal(mergeFieldList.length, 8);
          assert.equal(mergeFieldList[0].childNodes.length, 3);
          assert.equal(mergeFieldList[0].childNodes[0].textContent.trim(), 'Version:');
          assert.equal(mergeFieldList[0].childNodes[1].textContent.trim(), '2.1');
          assert.equal(mergeFieldList[0].childNodes[2].textContent.trim(), '3.0');
          assert.equal(mergeFieldList[4].childNodes.length, 3);
          assert.equal(mergeFieldList[4].childNodes[0].textContent.trim(), 'E-Mail:');
          assert.equal(mergeFieldList[4].childNodes[1].textContent.trim(), 'uwe@uwegerdes.de (!)');
          let formData = {};
          const fd = new document.defaultView.FormData(form);
          let e = fd.entries();
          for (let current = e.next(); !current.done; current = e.next()) {
            formData[current.value[0]] = current.value[1];
          }
          assert.deepEqual(formData, formDataCompare);
          done();
        });
    });
  });
});

const formDataCompare = { version: '2.1',
  n: 'Gerdes;Uwe;;;',
  fn: 'Uwe Gerdes',
  tel10: '040 256486',
  tel10_type: 'voice',
  tel11: '0179 3901008',
  tel11_type: 'cell',
  tel20: '+49 40 25178252',
  tel20_type: 'voice',
  tel21: '01793901008',
  tel21_type: 'cell',
  email1: 'uwe@uwegerdes.de',
  email1_type: 'pref',
  email2: 'entwicklung@uwegerdes.de',
  email2_type: 'internet',
  url: 'http://www.uwegerdes.de/',
  adr2: ';;Klaus-Groth-Str. 22;Hamburg;;20535;Germany',
  adr2_type: 'home',
  rev: '2014-08-24T18:50:00Z'
};

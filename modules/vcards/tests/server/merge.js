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
          const mergeFieldList = document.querySelectorAll('#merge #fieldList > .list-item');
          assert.equal(mergeFieldList.length, 9);
          assert.equal(mergeFieldList[0].childNodes.length, 3);
          assert.equal(mergeFieldList[0].childNodes[0].textContent.trim(), 'Version:');
          assert.equal(mergeFieldList[0].childNodes[1].textContent.trim(), '2.1');
          assert.equal(mergeFieldList[0].childNodes[2].textContent.trim(), '3.0');
          assert.equal(mergeFieldList[4].childNodes.length, 3);
          assert.equal(mergeFieldList[4].childNodes[0].textContent.trim(), 'E-Mail:');
          assert.equal(mergeFieldList[4].childNodes[1].textContent.trim(), 'uwe@uwegerdes.de (!)');
          assert.equal(mergeFieldList[7].childNodes.length, 3);
          assert.equal(mergeFieldList[7].childNodes[0].textContent.trim(), 'Adresse:');
          assert.equal(mergeFieldList[7].childNodes[2].textContent.trim(),
                        'Klaus-Groth-Str. 22 20535 Hamburg Germany  (privat)');
          assert.equal(mergeFieldList[8].childNodes.length, 3);
          assert.equal(mergeFieldList[8].childNodes[0].textContent.trim(), 'Revision:');
          assert.equal(mergeFieldList[8].childNodes[2].textContent.trim(), '2014-8-24 20:50:00');
          let formData = {};
          const fd = new document.defaultView.FormData(form);
          let e = fd.entries();
          for (let current = e.next(); !current.done; current = e.next()) {
            formData[current.value[0]] = current.value[1];
          }
          formDataCompare.xTimestamp = formData.xTimestamp;
          assert.deepEqual(formData, formDataCompare);
          done();
        });
    });
  });
});

const formDataCompare = { version: '2.1',
  n: '{"Nachname":"Gerdes","Vorname":"Uwe"}',
  fn: 'Uwe Gerdes',
  tel10: '040 256486',
  tel10_type: 'voice',
  tel11: '0179 3901008',
  tel11_type: 'cell',
  tel20: '+49 40 25178252',
  tel20_type: 'voice',
  tel21: '01793901008',
  tel21_type: 'cell',
  email10: 'uwe@uwegerdes.de',
  email10_type: 'pref',
  email20: 'entwicklung@uwegerdes.de',
  email20_type: 'internet',
  url: 'http://www.uwegerdes.de/',
  adr20: '{"Straße":"Klaus-Groth-Str. 22","Ort":"Hamburg","PLZ":"20535","Land":"Germany"}',
  adr20_type: 'home',
  rev: '2014-8-24 20:50:00',
  xGroupMembership10: 'Ich',
  xGroupMembership11: 'Uwe',
  xGroupMembership21: 'Entwickler',
  xStatus: 'merge'
};

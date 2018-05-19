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
  describe('GET /vcards/merge/0/1/', function () {
    it('should not have edit button', function (done) {
      chai.request('http://172.25.0.2:8080')
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
      chai.request('http://172.25.0.2:8080')
        .get('/vcards/merge/0/1/')
        .end(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          const { document } = (new JSDOM(res.text)).window;
          const mergeFieldList = document.querySelectorAll('#mergeView #fieldList > .list-item');
          assert.equal(mergeFieldList.length, 8);
          assert.equal(mergeFieldList[0].childNodes.length, 3);
          assert.equal(mergeFieldList[0].childNodes[0].textContent.trim(), 'Version:');
          assert.equal(mergeFieldList[0].childNodes[1].textContent.trim(), '2.1');
          assert.equal(mergeFieldList[0].childNodes[2].textContent.trim(), '3.0');
          done();
        });
    });
  });
});

/**
 * Test for vCard data model
 */
'use strict';

const assert = require('assert'),
  path = require('path');

const vcards = require('../../model/vcard.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('vcard model', () => {
  describe('get()', () => {
    it('should return Array with at least one entry', () => {
      assert.equal(vcards.get().length > 0, true);
      assert.equal(vcards.get()[0].name, 'Gerdes');
    });
  });
  describe('getTestData()', () => {
    it('should dive into the data structure', () => {
      const vcard = vcards.getTestData()[0];
      assert.equal(vcards.getTestData().length > 0, true);
      assert.equal(vcard.get('n').valueOf(), 'Gerdes;Uwe;;;');
      assert.equal(typeof vcard.get('tel').valueOf(), 'object');
      assert.equal(typeof vcard.get('tel')[0].type, 'object');
      assert.equal(typeof vcard.get('tel')[0].valueOf(), 'string');
      assert.deepEqual(vcard.get('tel')[0].type, ['work', 'voice']);
      assert.equal(vcard.get('tel')[0].valueOf(), '040/23519934');
      assert.equal(vcard.get('email').type, 'pref');
      assert.equal(vcard.get('email').valueOf(), 'uwe@uwegerdes.de');
    });
  });
  describe('get test file contents', () => {
    let testData;
    before(function (done) {
      vcards.open(path.join(__dirname, 'testdata.vcf'))
      .then(function (data) {
        testData = data;
      })
      .then(done);
    });
    it('should return Array with at least two entries', () => {
      assert.equal(testData.length > 1, true);
      assert.equal(testData[0].get('n').valueOf(), 'Gerdes;Uwe;;;');
      assert.equal(testData[1].get('n').valueOf(), 'Gerdes;Uwe');
    });
  });
  describe('read file, make Vcard list and', () => {
    let testData = [];
    before(function (done) {
      vcards.open(path.join(__dirname, 'testdata.vcf'))
      .then(function (data) {
        data.forEach((card) => { // jscs:ignore jsDoc
          testData.push(new vcards.Vcard(card));
        });
      })
      .then(done);
    });
    describe('get fields', () => {
      it('should return Array with field names', () => {
        assert.deepEqual(testData[0].getFields(), ['version', 'n', 'fn', 'tel', 'email', 'url']);
        assert.deepEqual(testData[1].getFields(),
          ['version', 'n', 'fn', 'tel', 'adr', 'email', 'rev']);
      });
    });
    describe('get data', () => {
      it('should return string for n', () => {
        assert.deepEqual(testData[0].getValue('n'), 'Gerdes;Uwe;;;');
        assert.deepEqual(testData[1].getValue('n'), 'Gerdes;Uwe');
      });
    });
    describe('get data', () => {
      it('should return Array for tel', () => {
        assert.deepEqual(testData[0].getValue('tel'),
          [
            { type: ['work', 'voice'], value: '040 256486' },
            { type: 'cell', value: '0179 3901008' }
          ]
        );
        assert.deepEqual(testData[1].getValue('tel'),
          [
            { type: ['work', 'voice'], value: '+49 40 25178252' },
            { type: 'cell', value: '01793901008' }
          ]
        );
      });
    });
  });
});

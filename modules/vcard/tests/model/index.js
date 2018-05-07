/**
 * Test for vCard data model
 */
'use strict';

const assert = require('assert'),
  path = require('path');

const vcards = require('../../model/vcard.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('vcard', () => {
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
});

/**
 * Test for vCard data model
 */
'use strict';

const assert = require('assert');

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
});

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
});

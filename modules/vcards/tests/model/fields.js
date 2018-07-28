/**
 * Test for vCard data model proxy
 */
'use strict';

const assert = require('assert')
  ;

const model = require('../../server/model.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('vcard fields', () => {
  it('should have fields', () => {
    assert.equal(Object.keys(model.fields).length > 0, true, 'fields.length > 0');
    const keylist = ['version', 'n', 'fn', 'tel', 'adr', 'email', 'url', 'org',
      'xGroupMembership', 'photo', 'rev', 'xStatus', 'xTimestamp'];
    assert.deepEqual(Object.keys(model.fields), keylist);
  });
  it('should have xTimestamp with default function', () => {
    assert.equal(Object.keys(model.fields.xTimestamp).length > 0, true, 'xTimestamp.length > 0');
    const keylist = ['label', 'type', 'size', 'default'];
    assert.deepEqual(Object.keys(model.fields.xTimestamp), keylist);
    assert.ok(model.fields.xTimestamp.default instanceof Function,
      'xTimestamp.default instanceof Function');
  });
});
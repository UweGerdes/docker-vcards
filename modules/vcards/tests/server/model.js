/**
 * Test for vCard data model
 */
'use strict';

const assert = require('assert'),
  path = require('path');

const model = require('../../server/model.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('vcard model', () => {
  describe('get()', () => {
    it('should return Array with at least one entry', () => {
      assert.equal(model.get().length > 0, true);
      assert.equal(model.get()[0].name, 'Gerdes');
    });
  });
  describe('getTestData()', () => {
    it('should dive into the data structure', () => {
      const vcard = model.getTestData()[0];
      assert.equal(model.getTestData().length > 0, true);
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
      model.open(path.join(__dirname, 'testdata.vcf'))
      .then(function (data) {
        testData = model.list();
        assert.equal(data, undefined);
      })
      .then(done);
    });
    it('should return Array with at least two entries', () => {
      assert.equal(testData.length > 1, true);
      assert.equal(testData[0].getValue('n'), 'Gerdes;Uwe;;;');
      assert.equal(testData[1].getValue('n'), 'Gerdes;Uwe');
    });
  });
  describe('read file, make Vcard list and', () => {
    let testData = [];
    before(function (done) {
      model.open(path.join(__dirname, 'testdata.vcf'))
      .then(function (data) {
        testData = model.list();
        assert.equal(data, 'testdata');
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
  describe('build vcard from data', () => {
    let testData = [];
    beforeEach(function (done) {
      model.open(path.join(__dirname, 'testdata.vcf'))
      .then(function () {
        testData = model.list();
      })
      .then(done);
    });
    it('should return vcard equal to testData', () => {
      const vcard = model.list()[0].vcard;
      const vcard2 = model.save(0, {
        version: '2.1',
        n: 'Gerdes;Uwe;;;',
        fn: 'Uwe Gerdes',
        tel0: '040 256486',
        tel0_type: ['work', 'voice'],
        tel1: '0179 3901008',
        tel1_type: 'cell',
        email: 'uwe@uwegerdes.de',
        email_type: 'pref',
        url: 'http://www.uwegerdes.de/'
      });
      assert.equal(model.list().length, 2);
      assert.deepEqual(vcard.toJSON(), vcard2.toJSON());
    });
    it('should add a new vcard to list', () => {
      model.save(2, {
        version: '2.1',
        n: 'Gerdes;Uwe;TEST;;',
        fn: 'Uwe Gerdes TEST',
        tel0: '040/256486',
        tel0_type: ['work', 'voice'],
        tel1: '0179 3901008',
        tel1_type: 'cell',
        email: 'uwe@uwegerdes.de',
        email_type: 'pref',
        url: 'http://www.uwegerdes.de/'
      });
      assert.equal(model.list().length, 3);
    });
  });
});

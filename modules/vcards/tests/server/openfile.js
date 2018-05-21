/**
 * Test for vCard open file
 */
'use strict';

const assert = require('assert'),
  path = require('path');

const model = require('../../server/model.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('vcard openfile', () => {
  let testData;
  before(function (done) {
    console.log('open userdata.vcf');
    model.open(path.join(__dirname, 'userdata.vcf'))
    .then(function () {
      testData = model.list();
    })
    .then(done);
  });
  after(function (done) {
    console.log('open testdata.vcf');
    model.open(path.join(__dirname, 'testdata.vcf'))
    .then(function () {
      done();
    });
  });
  describe('get test file contents', () => {
    it('should return Array with at least two entries', () => {
      assert.equal(testData.length > 1, true);
      assert.equal(testData[0].getValue('n'), 'Gerdes;Uwe;User;;');
      assert.equal(testData[1].getValue('n'), 'Gerdes;Uwe;User');
    });
  });
  describe('read file, make Vcard list and', () => {
    describe('get fields', () => {
      it('should return Array with field names', () => {
        assert.deepEqual(testData[0].getFields(), ['version', 'n', 'fn', 'tel', 'email', 'url']);
        assert.deepEqual(testData[1].getFields(),
          ['version', 'n', 'fn', 'tel', 'adr', 'email', 'rev']);
      });
    });
    describe('get data', () => {
      it('should return string for n', () => {
        assert.deepEqual(testData[0].getValue('n'), 'Gerdes;Uwe;User;;');
        assert.deepEqual(testData[1].getValue('n'), 'Gerdes;Uwe;User');
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
    it('should return vcard equal to testData', () => {
      const vcard = testData[0].vcard;
      const vcard2 = model.save(0, {
        version: '2.1',
        n: 'Gerdes;Uwe;User;;',
        fn: 'Uwe Gerdes',
        tel0: '040 256486',
        tel0_type: ['work', 'voice'],
        tel1: '0179 3901008',
        tel1_type: 'cell',
        email: 'uwe@uwegerdes.de',
        email_type: 'pref',
        url: 'http://www.uwegerdes.de/'
      });
      assert.equal(testData.length, 2);
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
      assert.equal(testData.length, 3);
    });
  });
});

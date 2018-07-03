/**
 * Test for vCard data model proxy
 */
'use strict';

const assert = require('assert'),
  path = require('path')
  ;

const model = require('../../server/model.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('vcard testproxy', () => {
  describe('getTestData()', () => {
    let testData = [];
    before(function (done) {
      model.open(path.join(__dirname, 'testdata.vcf'))
      .then(function (data) {
        testData = model.list();
        assert.equal(data, 'testdata');
      })
      .then(done);
    });
    describe('fields proxy', () => {
      it('should proxy access to properties', () => {
        assert.equal(testData.length > 0, true);
        const vcard = testData[0];
        assert.equal(vcard.get('n').valueOf(), 'Gerdes;Uwe;;;');
        assert.equal(vcard.text.n, 'Gerdes, Uwe');
        assert.deepEqual(vcard.prop.n, { value: { Nachname: 'Gerdes', Vorname: 'Uwe' } });
        assert.deepEqual(vcard.text.tel, ['040 256486 (work, voice)', '0179 3901008 (cell)']);
        assert.deepEqual(vcard.prop.tel,
          [
            { type: ['work', 'voice'], value: '040 256486' },
            { type: 'cell', value: '0179 3901008' }
          ]
        );
        assert.deepEqual(vcard.text.email, ['uwe@uwegerdes.de (pref)']);
        assert.deepEqual(vcard.prop.email, [{ type: 'pref', value: 'uwe@uwegerdes.de' }]);
      });
    });
  });
});

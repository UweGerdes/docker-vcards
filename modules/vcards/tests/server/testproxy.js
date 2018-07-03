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
        assert.equal(vcard.text.n, 'Gerdes;Uwe;;;', 'proxy text n');
        assert.deepEqual(vcard.value.n,
          { Nachname: 'Gerdes', Vorname: 'Uwe' },
          'proxy value n'
        );
        assert.equal(vcard.type.n, undefined, 'proxy type n');
        assert.deepEqual(vcard.value.tel,
          [
            { type: ['work', 'voice'], value: '040 256486' },
            { type: 'cell', value: '0179 3901008' }
          ],
          'proxy value tel'
        );
        assert.deepEqual(vcard.value.email,
          [{ type: 'pref', value: 'uwe@uwegerdes.de' }],
          'proxy value email'
        );
      });
    });
  });
});

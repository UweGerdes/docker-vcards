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
        assert.equal(testData.length > 0, true);
      })
      .then(done);
    });
    describe('fields proxy', () => {
      it('should proxy prop get', () => {
        const vcard = testData[0];
        assert.equal(vcard.get('n').valueOf(), 'Gerdes;Uwe;;;');
        assert.deepEqual(vcard.text.n, { Nachname: 'Gerdes', Vorname: 'Uwe' });
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
      it('should proxy prop set value', () => {
        const vcard = testData[0];
        vcard.prop.fn = { value: 'Uwe Gerdes Home', params: { } };
        assert.deepEqual(vcard.prop.fn, { value: 'Uwe Gerdes Home' });
        assert.equal(vcard.get('fn').valueOf(), 'Uwe Gerdes Home');
      });
      it('should proxy prop set parts', () => {
        const vcard = testData[0];
        vcard.prop.n = { value: { Nachname: 'Gerdes', Vorname: 'Uwe', part3: 'Home' },
                          params: { } };
        assert.deepEqual(vcard.text.n, { Nachname: 'Gerdes', Vorname: 'Uwe', part3: 'Home' });
        assert.equal(vcard.get('n').valueOf(), 'Gerdes;Uwe;Home;;');
      });
      it('should proxy prop add list', () => {
        const vcard = testData[0];
        vcard.prop.tel = { value: '040 25178252', params: { type: 'voice' } };
        assert.deepEqual(vcard.text.tel,
              ['040 256486 (work, voice)', '0179 3901008 (cell)', '040 25178252 (voice)']);
      });
      it('should proxy prop add to empty list with parts', () => {
        const vcard = testData[0];
        vcard.prop.adr = { value: { 'Straße': 'Klaus-Groth-Str. 22', 'Ort': 'Hamburg',
                                    'PLZ': '20535', 'Land': 'Germany' },
                          params: { } };
        assert.deepEqual(vcard.text.adr, [{ 'Straße': 'Klaus-Groth-Str. 22', Ort: 'Hamburg',
                                            PLZ: '20535', Land: 'Germany' }]);
        assert.equal(vcard.get('adr').valueOf(), ';;Klaus-Groth-Str. 22;Hamburg;;20535;Germany');
      });
    });
  });
});

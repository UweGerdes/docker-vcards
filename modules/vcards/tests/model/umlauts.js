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

describe('vcard umlaut', () => {
  let testData = [];
  before(function (done) {
    model.open(path.join(__dirname, '..', 'data', 'testumlauts.vcf'))
    .then(function (data) {
      testData = model.list();
      assert.equal(data, 'testdata');
      assert.equal(testData.length, 3);
    })
    .then(done);
  });
  describe('should proxy prop', () => {
    it('get value', () => {
      const vcard = testData[2];
      assert.equal(vcard.get('fn').valueOf(), '=53=63=68=C3=B6=6E=65=77=65=69=C3=9F');
      assert.equal(vcard.text.fn, 'Schöneweiß');
      assert.deepEqual(vcard.prop.fn, { value: 'Schöneweiß', encoding: 'QUOTED-PRINTABLE' });
    });
    it('set value', () => {
      const vcard = testData[0];
      vcard.prop.fn = { value: 'Uwe Gerdes äöü', params: { } };
      assert.deepEqual(vcard.prop.fn, { value: 'Uwe Gerdes äöü', encoding: 'QUOTED-PRINTABLE' });
      assert.equal(vcard.get('fn').valueOf(),
                  '=55=77=65=20=47=65=72=64=65=73=20=C3=A4=C3=B6=C3=BC');
    });
    it('get parts', () => {
      const vcard = testData[2];
      assert.equal(vcard.get('n').valueOf(), '=53=63=68=C3=B6=6E=65=77=65=69=C3=9F;;;;');
      assert.deepEqual(vcard.text.n, { Nachname: 'Schöneweiß' });
      assert.deepEqual(vcard.prop.n,
                      { value: { Nachname: 'Schöneweiß' }, encoding: 'QUOTED-PRINTABLE' });
    });
    it('set parts', () => {
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
    it('should proxy prop set timestamp', () => {
      const vcard = testData[0];
      vcard.prop.rev = { value: '2014-8-24 20:50:00', params: { } };
      assert.deepEqual(vcard.prop.rev, { value: '2014-8-24 20:50:00' });
      assert.equal(vcard.get('rev').valueOf(), '2014-08-24T18:50:00Z');
    });
    it('should proxy prop set value encoded', () => {
      const vcard = testData[0];
      vcard.prop.fn = { value: 'Uwe äöüÄÖÜß.', params: { } };
      assert.equal(vcard.text.fn, 'Uwe äöüÄÖÜß.');
      assert.deepEqual(vcard.prop.fn, { value: 'Uwe äöüÄÖÜß.', encoding: 'QUOTED-PRINTABLE' });
      assert.equal(vcard.get('fn').valueOf(),
                  '=55=77=65=20=C3=A4=C3=B6=C3=BC=C3=84=C3=96=C3=9C=C3=9F=2E');
    });
    it('should proxy fields list', () => {
      const vcard = testData[0];
      assert.deepEqual(vcard.fields, ['version', 'n', 'fn', 'tel', 'email', 'url', 'adr', 'rev']);
    });
  });
});

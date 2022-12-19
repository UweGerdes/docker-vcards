/**
 * Test for vCard data model proxy
 */

'use strict';

const assert = require('assert'),
  path = require('path');
const model = require('../../server/model.js');

/* jshint mocha: true */
/* jscs:disable jsDoc */

describe('vcard proxy', () => {
  let testData = [];
  before(function (done) {
    model.open(path.join(__dirname, '..', 'data', 'testdata.vcf'))
      .then(function () {
        testData = model.list();
        assert.equal(testData.length > 0, true);
      })
      .then(done)
      .catch(error => console.log(error));
  });
  describe('should proxy', () => {
    it('prop get', () => {
      const vcard = testData[0];
      assert.equal(vcard.get('n').valueOf(), 'Gerdes;Uwe;;;');
      assert.equal(vcard.text.n, 'Gerdes, Uwe');
      assert.deepEqual(vcard.prop.n, { value: { Nachname: 'Gerdes', Vorname: 'Uwe' } });
      assert.equal(vcard.text.tel, '040 256486 (work, voice)\n0179 3901008 (cell)');
      assert.deepEqual(
        vcard.prop.tel,
        [
          { type: ['work', 'voice'], value: '040 256486' },
          { type: 'cell', value: '0179 3901008' }
        ]
      );
      assert.deepEqual(vcard.text.email, 'uwe@uwegerdes.de (pref)');
      assert.deepEqual(vcard.prop.email, [{ type: 'pref', value: 'uwe@uwegerdes.de' }]);
    });
    it('prop set value', () => {
      const vcard = testData[0];
      vcard.prop.fn = { value: 'Uwe Gerdes Home', params: { } };
      assert.deepEqual(vcard.prop.fn, { value: 'Uwe Gerdes Home' });
      assert.equal(vcard.get('fn').valueOf(), 'Uwe Gerdes Home');
    });
    it('prop set parts', () => {
      const vcard = testData[0];
      vcard.prop.n = {
        value: { Nachname: 'Gerdes', Vorname: 'Uwe', Zusatz: 'Home' },
        params: { }
      };
      assert.equal(vcard.text.n, 'Gerdes, Uwe, Home');
      assert.deepEqual(vcard.prop.n.value, { Nachname: 'Gerdes', Vorname: 'Uwe', Zusatz: 'Home' });
      assert.equal(vcard.get('n').valueOf(), 'Gerdes;Uwe;;;Home');
    });
    it('prop add list', () => {
      const vcard = testData[0];
      vcard.prop.tel = { value: '040 25178252', params: { type: 'voice' } };
      assert.equal(vcard.text.n, 'Gerdes, Uwe, Home');
      assert.equal(
        vcard.text.tel,
        '040 256486 (work, voice)\n0179 3901008 (cell)\n040 25178252 (voice)'
      );
      assert.deepEqual(vcard.prop.tel, [
        { value: '040 256486', type: ['work', 'voice'] },
        { value: '0179 3901008', type: 'cell' },
        { value: '040 25178252', type: 'voice' }
      ]);
    });
    it('prop add to empty list with parts', () => {
      const vcard = testData[0];
      vcard.prop.adr = {
        value: {
          'Straße': 'Klaus-Groth-Str. 22',
          'Ort': 'Hamburg',
          'PLZ': '20535',
          'Land': 'Germany'
        },
        params: { }
      };
      assert.equal(vcard.text.adr, 'Klaus-Groth-Str. 22, Hamburg, 20535, Germany');
      assert.deepEqual(vcard.prop.adr[0].value, {
        'Straße': 'Klaus-Groth-Str. 22',
        Ort: 'Hamburg',
        PLZ: '20535',
        Land: 'Germany'
      });
      assert.equal(vcard.get('adr').valueOf(), ';;Klaus-Groth-Str. 22;Hamburg;;20535;Germany');
    });
    it('prop set timestamp', () => {
      const vcard = testData[0];
      vcard.prop.rev = { value: '2014-08-24 20:50:00', params: { } };
      assert.deepEqual(vcard.prop.rev, { value: '2014-08-24 20:50:00' });
      assert.equal(vcard.get('rev').valueOf(), '20140824T185000Z');
    });
    it('prop set value encoded', () => {
      const vcard = testData[0];
      vcard.prop.fn = { value: 'Uwe äöüÄÖÜß.', params: { } };
      assert.equal(vcard.text.fn, 'Uwe äöüÄÖÜß.');
      assert.deepEqual(
        vcard.prop.fn,
        { value: 'Uwe äöüÄÖÜß.', encoding: 'QUOTED-PRINTABLE', charset: 'UTF-8' }
      );
      assert.equal(
        vcard.get('fn').valueOf(),
        '=55=77=65=20=C3=A4=C3=B6=C3=BC=C3=84=C3=96=C3=9C=C3=9F=2E'
      );
    });
    it('fields list', () => {
      const vcard = testData[0];
      assert.deepEqual(
        vcard.fields,
        ['version', 'n', 'fn', 'tel', 'email', 'url', 'xGroupMembership', 'adr', 'rev']
      );
    });
  });
});

/**
 * Test for vCard data model proxy
 */

'use strict';

const assert = require('assert'),
  path = require('path');
const model = require('../../server/model.js');

describe('tests/model/umlaut', () => {
  let testData = [];
  before(function (done) {
    model.open(path.join(__dirname, '..', 'data', 'testumlauts.vcf'))
      .then(function () {
        testData = model.list();
        assert.equal(testData.length, 3);
      })
      .then(done)
      .catch(error => console.log(error));
  });
  describe('should', () => {
    it('get value', () => {
      const vcard = testData[2];
      assert.equal(vcard.get('fn').valueOf(), '=53=63=68=C3=B6=6E=65=77=65=69=C3=9F');
      assert.equal(vcard.text.fn, 'Schöneweiß');
      assert.deepEqual(
        vcard.prop.fn,
        { value: 'Schöneweiß', encoding: 'QUOTED-PRINTABLE', charset: 'UTF-8' }
      );
    });
    it('set value', () => {
      const vcard = testData[0];
      vcard.prop.fn = { value: 'Uwe Gerdes äöü', params: { } };
      assert.equal(vcard.text.fn, 'Uwe Gerdes äöü');
      assert.deepEqual(
        vcard.prop.fn,
        { value: 'Uwe Gerdes äöü', encoding: 'QUOTED-PRINTABLE', charset: 'UTF-8' }
      );
      assert.equal(
        vcard.get('fn').valueOf(),
        '=55=77=65=20=47=65=72=64=65=73=20=C3=A4=C3=B6=C3=BC'
      );
    });
    it('get parts', () => {
      const vcard = testData[2];
      assert.equal(vcard.get('n').valueOf(), '=53=63=68=C3=B6=6E=65=77=65=69=C3=9F;;;;');
      // assert.deepEqual(vcard.text.n, { Nachname: 'Schöneweiß' });
      assert.deepEqual(
        vcard.prop.n,
        { value: { Nachname: 'Schöneweiß' }, encoding: 'QUOTED-PRINTABLE', charset: 'UTF-8' }
      );
    });
    it('set parts', () => {
      const vcard = testData[2];
      vcard.prop.n = {
        value: { Nachname: 'Schöneweiß', Vorname: 'Herbert' },
        params: { }
      };
      // assert.deepEqual(vcard.text.n, { Nachname: 'Schöneweiß', Vorname: 'Herbert' });
      assert.deepEqual(vcard.prop.n, {
        value: { Nachname: 'Schöneweiß', Vorname: 'Herbert' },
        encoding: 'QUOTED-PRINTABLE',
        charset: 'UTF-8'
      });
      assert.equal(
        vcard.get('n').valueOf(),
        '=53=63=68=C3=B6=6E=65=77=65=69=C3=9F;=48=65=72=62=65=72=74;;;'
      );
    });
    it('should proxy prop add list', () => {
      const vcard = testData[2];
      vcard.prop.xGroupMembership = { value: 'Hühnerhaufen', params: { } };
      // assert.deepEqual(vcard.text.xGroupMembership,
      //       ['Vermittler', 'My Contacts', 'Hühnerhaufen']);
      assert.deepEqual(
        vcard.prop.xGroupMembership,
        [{ 'value': 'Vermittler' }, { 'value': 'My Contacts' },
          { 'value': 'Hühnerhaufen', 'charset': 'UTF-8', 'encoding': 'QUOTED-PRINTABLE' }]
      );
      assert.equal(vcard.get('xGroupMembership').valueOf()[2].encoding, 'QUOTED-PRINTABLE');
      assert.equal(vcard.get('xGroupMembership').valueOf()[2].charset, 'UTF-8');
      assert.equal(
        vcard.get('xGroupMembership').valueOf()[2].valueOf(),
        '=48=C3=BC=68=6E=65=72=68=61=75=66=65=6E'
      );
    });
    it('should proxy prop set value encoded', () => {
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
  });
});

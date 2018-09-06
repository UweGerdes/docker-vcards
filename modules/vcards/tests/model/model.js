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
      model.open(path.join(__dirname, '..', 'data', 'testdata.vcf'))
      .then(function (data) {
        testData = model.list();
        assert.equal(data, undefined);
      })
      .then(done);
    });
    it('should return Array with at least two entries', () => {
      assert.equal(testData.length > 1, true);
    });
  });
  describe('read file, make Vcard list and', () => {
    let testData = [];
    before(function (done) {
      model.open(path.join(__dirname, '..', 'data', 'testdata.vcf'))
      .then(function (data) {
        testData = model.list();
        assert.equal(data, 'testdata');
      })
      .then(done);
    });
    describe('get fields', () => {
      it('should return Array with field names', () => {
        assert.deepEqual(testData[0].fields,
          ['version', 'n', 'fn', 'tel', 'email', 'url', 'xGroupMembership']);
        assert.deepEqual(testData[1].fields,
          ['version', 'n', 'fn', 'tel', 'adr', 'email', 'rev', 'xGroupMembership']);
      });
    });
    describe('get data', () => {
      it('should return map for n', () => {
        assert.equal(testData[0].get('n').valueOf(), 'Gerdes;Uwe;;;');
        assert.deepEqual(testData[0].prop.n.value, { Nachname: 'Gerdes', Vorname: 'Uwe' });
        assert.equal(testData[1].get('n').valueOf(), 'Gerdes;Uwe');
        assert.deepEqual(testData[1].prop.n.value, { Nachname: 'Gerdes', Vorname: 'Uwe' });
      });
    });
    describe('get data', () => {
      it('should return Array for tel', () => {
        assert.deepEqual(testData[0].prop.tel,
          [
            { type: ['work', 'voice'], value: '040 256486' },
            { type: 'cell', value: '0179 3901008' }
          ]
        );
        assert.deepEqual(testData[1].prop.tel,
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
      model.open(path.join(__dirname, '..', 'data', 'testdata.vcf'))
      .then(function () {
        testData = model.list();
      })
      .then(done);
    });
    it('should return vcard equal to testData[0]', () => {
      const vcard0 = model.list()[0].vcard.toJSON();
      const vcard2 = model.save(2, {
        version: '2.1',
        n_Vorname: 'Uwe',
        n_Nachname: 'Gerdes',
        fn: 'Uwe Gerdes',
        tel0: '040 256486',
        tel0_type: [
          'work',
          'voice'
        ],
        select_tel0: '',
        tel1: '0179 3901008',
        tel1_type: 'cell',
        select_tel1: '',
        email0: 'uwe@uwegerdes.de',
        email0_type: 'pref',
        select_email0: '',
        url: 'http://www.uwegerdes.de/',
        select_url: '',
        xGroupMembership0: 'Ich',
        xGroupMembership1: 'Uwe'
      }).toJSON();
      assert.equal(model.list().length, 3);
      assert.deepEqual(vcard2, vcard0);
    });
    it('should add a new vcard to list', () => {
      const vcard0 = ['vcard', [
        ['version', { }, 'text', '2.1'],
        ['n', { }, 'text', ['Gerdes (test)', 'Uwe Wilhelm', '', 'Dipl. Ing. FH', '']],
        ['fn', { }, 'text', 'Uwe Gerdes neu'],
        ['tel', { type: ['work', 'voice'] }, 'text', '040 256486 neu'],
        ['tel', { type: 'home' }, 'text', '040 25178252 neu'],
        ['adr', { type: 'home' }, 'text',
                ['', '', 'Klaus-Groth-Str. 22', 'Hamburg', '', '20535', 'Germany']],
        ['email', { type: 'pref' }, 'text', 'uwe@uwegerdes.de neu'],
        ['xGroupMembership', { }, 'text', 'new vcard test']
      ]];
      const vcard1 = model.save(2, {
        version: '2.1',
        n_Vorname: 'Uwe Wilhelm',
        n_Nachname: 'Gerdes (test)',
        n_Titel: 'Dipl. Ing. FH',
        n_part3: '',
        n_part5: '',
        fn: 'Uwe Gerdes neu',
        tel0: '040 256486 neu',
        tel0_type: [
          'work',
          'voice'
        ],
        select_tel0: '',
        tel2: '040 25178252 neu',
        tel2_type: 'home',
        select_tel1: '',
        email0: 'uwe@uwegerdes.de neu',
        email0_type: 'pref',
        select_email0: '',
        adr0: '{"Straße":"Klaus-Groth-Str. 22","Ort":"Hamburg","PLZ":"20535","Land":"Germany"}',
        adr0_type: 'home',
        xGroupMembership0: 'new vcard test',
      });
      assert.deepEqual(vcard1.toJSON(), vcard0);
      assert.equal(model.list().length, 3);
      const vcard2 = model.list()[2].vcard;
      assert.deepEqual(vcard2.toJSON(), vcard0);
    });
  });
  describe('vcard JSON', () => {
    let testData = [];
    beforeEach(function (done) {
      model.open(path.join(__dirname, '..', 'data', 'testdata.vcf'))
      .then(function () {
        testData = model.list();
      })
      .then(done);
    });
    it('should return vcard equal to testData', () => {
      const vcard0 = model.list()[0];
      const vcard1 = model.save(0, {
        version: '2.1',
        n_Vorname: 'Uwe',
        n_Nachname: 'Gerdes',
        n_Titel: '',
        n_part3: '',
        n_part5: '',
        fn: 'Uwe Gerdes',
        tel0: '040 256486',
        tel0_type: [
          'work',
          'voice'
        ],
        select_tel0: '',
        tel1: '0179 3901008',
        tel1_type: 'cell',
        select_tel1: '',
        email0: 'uwe@uwegerdes.de',
        email0_type: 'pref',
        select_email0: '',
        url: 'http://www.uwegerdes.de/',
        select_url: '',
        xGroupMembership0: 'Ich',
        xGroupMembership1: 'Uwe'
      });
      assert.deepEqual(vcard1.toJSON(), vcard0.toJSON());
    });
    it('should return vcards array equal to testData', () => {
      const json = [
        ['vcard', [
          ['version', { }, 'text', '2.1'],
          ['n', { }, 'text', ['Gerdes', 'Uwe', '', '', '']],
          ['fn', { }, 'text', 'Uwe Gerdes'],
          ['tel', { type: ['work', 'voice'] }, 'text', '040 256486'],
          ['tel', { type: 'cell' }, 'text', '0179 3901008'],
          ['email', { type: 'pref' }, 'text', 'uwe@uwegerdes.de'],
          ['url', { }, 'text', 'http://www.uwegerdes.de/'],
          ['xGroupMembership', { }, 'text', 'Ich'],
          ['xGroupMembership', { }, 'text', 'Uwe']
        ]],
        ['vcard', [
          ['version', { }, 'text', '3.0'],
          ['n', { }, 'text', ['Gerdes', 'Uwe']],
          ['fn', { }, 'text', 'Uwe Gerdes'],
          ['tel', { type: ['work', 'voice'] }, 'text', '+49 40 25178252'],
          ['tel', { type: 'cell' }, 'text', '01793901008'],
          ['adr', { type: 'home' }, 'text',
            ['', '', 'Klaus-Groth-Str. 22', 'Hamburg', '', '20535', 'Germany']
          ],
          ['email', { type: ['pref', 'internet'] }, 'text', 'entwicklung@uwegerdes.de'],
          ['rev', { }, 'text', '20140824T185000Z'],
          ['xGroupMembership', { }, 'text', 'Ich'],
          ['xGroupMembership', { }, 'text', 'Entwickler']
        ]]
      ];
      assert.deepEqual(model.toJSON(), json);
    });
  });
  describe('vcard VCF', () => {
    let testData = [];
    beforeEach(function (done) {
      model.open(path.join(__dirname, '..', 'data', 'testdata.vcf'))
      .then(function () {
        testData = model.list();
      })
      .then(done);
    });
    it('should return vcards VCF equal to testData', () => {
      const vcf = 'BEGIN:VCARD\n' +
                  'VERSION:4.0\n' +
                  'N:Gerdes;Uwe;;;\n' +
                  'FN:Uwe Gerdes\n' +
                  'TEL;TYPE=work,voice:040 256486\n' +
                  'TEL;TYPE=cell:0179 3901008\n' +
                  'EMAIL;TYPE=pref:uwe@uwegerdes.de\n' +
                  'URL:http://www.uwegerdes.de/\n' +
                  'X-GROUP-MEMBERSHIP:Ich\n' +
                  'X-GROUP-MEMBERSHIP:Uwe\n' +
                  'END:VCARD\n' +
                  'BEGIN:VCARD\n' +
                  'VERSION:4.0\n' +
                  'N:Gerdes;Uwe\n' +
                  'FN:Uwe Gerdes\n' +
                  'TEL;TYPE=work,voice:+49 40 25178252\n' +
                  'TEL;TYPE=cell:01793901008\n' +
                  'ADR;TYPE=home:;;Klaus-Groth-Str. 22;Hamburg;;20535;Germany\n' +
                  'EMAIL;TYPE=pref,internet:entwicklung@uwegerdes.de\n' +
                  'REV:20140824T185000Z\n' +
                  'X-GROUP-MEMBERSHIP:Ich\n' +
                  'X-GROUP-MEMBERSHIP:Entwickler\n' +
                  'END:VCARD\n';
      assert.equal(model.toVCF(), vcf);
    });
  });
  describe('collections', () => {
    it('should have selections', () => {
      assert.deepEqual(model.selections,
        {
          version: ['2.1', '3.0'],
          xGroupMembership: ['Ich', 'Uwe', 'Entwickler', 'new vcard test']
        }
      );
    });
  });
});

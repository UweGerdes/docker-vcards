/**
 * Testdata for vcards
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://vcards-e2e:8080';

module.exports = {
  group: 'vCards E2E Test',
  name: 'Edit vCard',
  viewports: {
    'Mobile': { width: 340, height: 568 },
    'Tablet': { width: 768, height: 1024 },
    'Desktop': { width: 1200, height: 900 }
  },
  testCases: {
    'Edit': {
      uri: domain + '/vcards/dataset/testdata',
      steps: {
        'start': {
          title: 'VCard Editor',
          elements: {
            '//h1[@id="headline"]': 'vcard',
            '//*[@id="list"]/li[1]/a': 'Uwe Gerdes',
            '//*[@id="list"]/li[2]/a': 'Uwe Gerdes',
            '//*[@id="searchButton"]': 'suchen'
          },
          elementsNotExist: [
            '//a[@id="editButton"]'
          ],
          click: 'a[href="/vcards/0/"]'
        },
        'vcard 0': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="version"]//*[@class="field-value"]': '2.1',
            '//*[@id="fn"]//*[@class="field-value"]': 'Uwe Gerdes',
            '//a[@id="editButton"]': ''
          },
          click: '#editButton'
        },
        'edit form': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//select[@name="version"]': '',
            '//form[@id="edit"]//input[@name="n_Nachname"][@value="Gerdes"]': '',
            '//form[@id="edit"]//input[@name="n_Vorname"][@value="Uwe"]': ''
          },
          input: {
            '//select[@name="version"]/option[@value="3.0"]': true,
            '//input[@name="fn"]': 'Uwe Gerdes Test'
          },
          click: '//form[@id="edit"]//input[@type="submit"]'
        },
        'change content': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test',
            '//*[@id="version"]//*[@class="field-value"]': '3.0',
            '//*[@id="fn"]//*[@class="field-value"]': 'Uwe Gerdes Test',
            '//*[@id="tel"]//*[@class="field-value"]':
                  '040 256486 (Arbeit, Sprache)\n0179 3901008 (Mobil)',
            '//a[@id="editButton"]': ''
          },
          click: '#editButton'
        },
        'edit form again': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//input[@name="n_Nachname"][@value="Gerdes"]': '',
            '//form[@id="edit"]//input[@name="n_Vorname"][@value="Uwe"]': '',
            '//form[@id="edit"]//input[@name="fn"][@value="Uwe Gerdes Test"]': '',
            '//form[@id="edit"]//input[@type="checkbox"][@name="tel0_type"][@value="voice"]': '',
            '//form[@id="edit"]//*[@type="checkbox"][@id="checkbox_tel0_1"][@value="voice"]': '',
            '//form[@id="edit"]//*[@for="checkbox_tel0_1"]': 'Sprache'
          },
          input: {
            '//select[@name="select_tel0"]/option[@value="home"]': true,
            '//input[@type="checkbox"][@name="tel0_type"][@value="voice"]': false
          },
          click: '//form[@id="edit"]//input[@type="submit"]'
        },
        'add and remove phone type': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test',
            '//*[@id="version"]//*[@class="field-value"]': '3.0',
            '//*[@id="fn"]//*[@class="field-value"]': 'Uwe Gerdes Test',
            '//*[@id="tel"]//*[@class="field-value"]':
                  '040 256486 (Arbeit, privat)\n0179 3901008 (Mobil)',
            '//a[@id="editButton"]': ''
          },
          elementsNotExist: [
            '//form[@id="edit"]'
          ],
          click: '#editButton'
        },
        'add phone number': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//*[@id="tel_container"]//*[@class="add"]': '+'
          },
          click: '//form[@id="edit"]//*[@id="tel_container"]//*[@class="add"]'
        },
        'add phone number fields': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//*[@id="tel_container"]//input[@type="text"][@name="tel2"]': '',
            '//form[@id="edit"]//*[@id="tel_container"]//select[@name="select_tel2"]': '',
            '//form[@id="edit"]//select[@name="select_tel2"]//option[@value="work"]': 'Arbeit'
          },
          input: {
            '//input[@name="tel2"]': '0123 123456',
            '//select[@name="select_tel2"]/option[@value="home"]': true,
            '//select[@name="select_tel2"]/option[@value="voice"]': true
          },
          click: '//form[@id="edit"]//input[@type="submit"]'
        },
        'add phone number input': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test',
            '//*[@id="tel"]//*[@class="field-value"]':
                '040 256486 (Arbeit, privat)\n0179 3901008 (Mobil)\n0123 123456 (Sprache, privat)'
          },
          elementsNotExist: [
            '//form[@id="edit"]'
          ],
          click: '#editButton'
        },
        'edit form for adding fields': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//select[@name="addField"]': ''
          },
          click: '//form[@id="edit"]//select[@name="addField"]/option[@value="org"]'
        },
        'added org field': {
          title: 'VCard Editor',
          elements: {
            '//form[@id="edit"]//select[@name="addField"]': '',
            '//form[@id="edit"]//*[@id="org_container"]//input[@type="text"][@name="org"]': ''
          },
          click: '//form[@id="edit"]//*[@id="xGroupMembership_container"]//*[@class="add"]'
        },
        'added xGroupMembership field': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]//select[@name="select_xGroupMembership"]': ''
          },
          click: '//form[@id="edit"]//select[@name="addField"]/option[@value="adr"]'
        },
        'added adr field': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]//*[@id="adr_container"]//input[@type="text"][@name="adr0_PLZ"]': '',
            '//form[@id="edit"]//*[@id="adr_container"]//select[@name="select_adr0"]': ''
          },
          input: {
            '//input[@name="org"]': 'Freiberufler',
            '//input[@name="rev"]': '2018-7-19 20:10:00',
            '//input[@name="adr0_Straße"]': 'Klaus-Groth-Str. 22',
            '//input[@name="adr0_PLZ"]': '20535',
            '//input[@name="adr0_Ort"]': 'Hamburg',
            '//select[@name="select_adr0"]/option[@value="home"]': true
          },
          click: '//form[@id="edit"]//input[@type="submit"]'
        },
        'input data and check result': {
          title: 'VCard Editor',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test',
            '//*[@id="org"]//*[@class="field-value"]': 'Freiberufler',
            '//*[@id="xGroupMembership"]//*[@class="field-value"]': 'Uwe',
            '//*[@id="adr"]//*[@class="field-value"]': 'Klaus-Groth-Str. 22, Hamburg, 20535 (privat)'
          },
          elementsNotExist: [
            '//form[@id="edit"]'
          ]
        }
        // TODO: add test for X-STATUS and X-TIMESTAMP
      }
    }
  }
};

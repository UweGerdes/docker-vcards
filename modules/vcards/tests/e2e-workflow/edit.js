/**
 * Testdata for vcards
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://vcards-e2e:8080';

module.exports = {
  name: 'default e2e workflow test',
  dumpDir: './results/modules/vcards-edit/',
  viewportSize: { width: 1500, height: 1024 },
  testCases: {
    'edit': {
      uri: domain + '/vcards/dataset/testdata',
      steps: {
        'start': {
          title: 'Webserver - vcard',
          elements: {
            '//h1[@class="headline"]': 'vcard',
            '//*[@id="list"]/li[1]/a': 'Uwe Gerdes',
            '//*[@id="list"]/li[2]/a': 'Uwe Gerdes',
            '//*[@id="searchButton"]': 'suchen',
          },
          elementsNotExist: [
            '//a[@id="editButton"]',
          ],
        },
        'vcard 0': {
          title: 'Webserver - vcard',
          click: 'a[href="/vcards/0/"]',
          elements: {
            '//*[@id="version"]//*[@class="itemvalue"]': '2.1',
            '//*[@id="fn"]//*[@class="itemvalue"]': 'Uwe Gerdes',
            '//a[@id="editButton"]': '',
          },
        },
        'edit form': {
          title: 'Webserver - vcard',
          click: '#editButton',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//input[@name="version"][@value="2.1"]': '',
            '//form[@id="edit"]//input[@name="n_Nachname"][@value="Gerdes"]': '',
            '//form[@id="edit"]//input[@name="n_Vorname"][@value="Uwe"]': '',
          }
        },
        'change content': {
          title: 'Webserver - vcard',
          input: {
            '//input[@name="version"]': '2.2',
            '//input[@name="fn"]': 'Uwe Gerdes Test',
          },
          click: '//form[@id="edit"]//input[@type="submit"]',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test',
            '//*[@id="version"]//*[@class="itemvalue"]': '2.2',
            '//*[@id="fn"]//*[@class="itemvalue"]': 'Uwe Gerdes Test',
            '//*[@id="tel"]//*[@class="itemvalue"]':
                  '040 256486 (Arbeit, Sprache)\n0179 3901008 (Mobil)',
            '//a[@id="editButton"]': '',
          }
        },
        'edit form again': {
          title: 'Webserver - vcard',
          click: '#editButton',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//input[@name="version"][@value="2.2"]': '',
            '//form[@id="edit"]//input[@name="n_Nachname"][@value="Gerdes"]': '',
            '//form[@id="edit"]//input[@name="n_Vorname"][@value="Uwe"]': '',
            '//form[@id="edit"]//input[@name="fn"][@value="Uwe Gerdes Test"]': '',
            '//form[@id="edit"]//input[@type="checkbox"][@name="tel0_type"][@value="voice"]': '',
            '//form[@id="edit"]//*[@type="checkbox"][@id="checkbox_tel0_1"][@value="voice"]': '',
            '//form[@id="edit"]//*[@for="checkbox_tel0_1"]': 'Sprache',
          }
        },
        'add and remove phone type': {
          title: 'Webserver - vcard',
          input: {
            '//select[@name="select_tel0"]/option[@value="home"]': true,
            '//input[@type="checkbox"][@name="tel0_type"][@value="voice"]': false,
          },
          click: '//form[@id="edit"]//input[@type="submit"]',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test',
            '//*[@id="version"]//*[@class="itemvalue"]': '2.2',
            '//*[@id="fn"]//*[@class="itemvalue"]': 'Uwe Gerdes Test',
            '//*[@id="tel"]//*[@class="itemvalue"]':
                  '040 256486 (Arbeit, privat)\n0179 3901008 (Mobil)',
            '//a[@id="editButton"]': '',
          },
          elementsNotExist: [
            '//form[@id="edit"]',
          ],
        },
        'edit form for add phone number': {
          title: 'Webserver - vcard',
          click: '#editButton',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//*[@id="tel_container"]//*[@class="add"]': '+',
          },
        },
        'add phone number fields': {
          title: 'Webserver - vcard',
          click: '//form[@id="edit"]//*[@id="tel_container"]//*[@class="add"]',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//*[@id="tel_container"]//input[@type="text"][@name="tel2"]': '',
            '//form[@id="edit"]//*[@id="tel_container"]//select[@name="select_tel2"]': '',
            '//form[@id="edit"]//select[@name="select_tel2"]//option[@value="work"]': 'Arbeit',
          },
        },
        'add phone number input': {
          title: 'Webserver - vcard',
          input: {
            '//input[@name="tel2"]': '0123 123456',
            '//select[@name="select_tel2"]/option[@value="home"]': true,
            '//select[@name="select_tel2"]/option[@value="voice"]': true,
          },
          click: '//form[@id="edit"]//input[@type="submit"]',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test',
            '//*[@id="tel"]//*[@class="itemvalue"]':
                '040 256486 (Arbeit, privat)\n0179 3901008 (Mobil)\n0123 123456 (privat, Sprache)',
          },
          elementsNotExist: [
            '//form[@id="edit"]',
          ],
        },
        'edit form for adding fields': {
          title: 'Webserver - vcard',
          click: '#editButton',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]': '',
            '//form[@id="edit"]//select[@name="addField"]': '',
          },
        },
        'add org field': {
          title: 'Webserver - vcard',
          click: '//form[@id="edit"]//select[@name="addField"]/option[@value="org"]',
          elements: {
            '//form[@id="edit"]//select[@name="addField"]': '',
          },
        },
        'add rev field': {
          title: 'Webserver - vcard',
          click: '//form[@id="edit"]//select[@name="addField"]/option[@value="rev"]',
          elements: {
            '//form[@id="edit"]//*[@id="org_container"]//input[@type="text"][@name="org"]': '',
            '//form[@id="edit"]//*[@id="rev_container"]//input[@type="text"][@name="rev"]': '',
          },
        },
        'add xGroupMembership field': {
          title: 'Webserver - vcard',
          click: '//form[@id="edit"]//select[@name="addField"]/option[@value="xGroupMembership"]',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]//input[@type="text"][@name="xGroupMembership0"]': '',
          },
        },
        'add adr field': {
          title: 'Webserver - vcard',
          click: '//form[@id="edit"]//select[@name="addField"]/option[@value="adr"]',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test bearbeiten',
            '//form[@id="edit"]//*[@id="adr_container"]//input[@type="text"][@name="adr0_PLZ"]': '',
            '//form[@id="edit"]//*[@id="adr_container"]//select[@name="select_adr0"]': '',
          },
        },
        'input data and check result': {
          title: 'Webserver - vcard',
          input: {
            '//input[@name="org"]': 'Freiberufler',
            '//input[@name="rev"]': '2018-7-19 20:10:00',
            '//input[@name="xGroupMembership0"]': 'ICH',
            '//input[@name="adr0_Straße"]': 'Klaus-Groth-Str. 22',
            '//input[@name="adr0_PLZ"]': '20535',
            '//input[@name="adr0_Ort"]': 'Hamburg',
            '//select[@name="select_adr0"]/option[@value="home"]': true,
          },
          click: '//form[@id="edit"]//input[@type="submit"]',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes Test',
            '//*[@id="org"]//*[@class="itemvalue"]': 'Freiberufler',
            '//*[@id="rev"]//*[@class="itemvalue"]': '2018-7-19 20:10:00',
            '//*[@id="xGroupMembership"]//*[@class="itemvalue"]': 'ICH',
            '//*[@id="adr"]//*[@class="itemvalue"]': 'Klaus-Groth-Str. 22, Hamburg, 20535',
          },
          elementsNotExist: [
            '//form[@id="edit"]',
          ],
        },
        // TODO: add test for X-STATUS and X-TIMESTAMP
      }
    }
  }
};


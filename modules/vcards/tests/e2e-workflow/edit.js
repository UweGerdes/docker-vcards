/**
 * Testdata for vcards
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://vcards-dev:8080';

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
            '//form[@id="edit"]//input[@name="n"][@value="Gerdes;Uwe;;;"]': '',
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
            '//form[@id="edit"]//input[@name="n"][@value="Gerdes;Uwe;;;"]': '',
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
      }
    }
  }
};


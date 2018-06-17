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
      title: 'Webserver - vcard',
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
      }
    }
  }
};


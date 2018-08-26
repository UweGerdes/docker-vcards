/**
 * Testdata for vcards
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://vcards-e2e:8080'

module.exports = {
  name: 'merge',
  viewportSize: { width: 1500, height: 1024 },
  testCases: {
    'merge': {
      uri: domain + '/vcards/dataset/testdata',
      steps: {
        'start': {
          title: 'Webserver - vcard',
          elements: {
            '//h1[@class="headline"]': 'vcard',
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
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="version"]//*[@class="itemvalue"]': '2.1',
            '//*[@id="fn"]//*[@class="itemvalue"]': 'Uwe Gerdes',
            '//a[@id="editButton"]': ''
          },
          click: '#searchButton'
        },
        'search layer': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@class="search-headline"]': 'Suchen',
            '//form[@name="searchForm"]': '',
            '//form[@name="searchForm"]//*[@id="search_version"]': '',
            '//form[@name="searchForm"]//*[@for="search_version"]': 'Version'
          },
          click: 'input[type="submit"]'
        },
        'search result, no input': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="searchLayer"]/div/h2': 'Suchen',
            '//*[@id="searchLayer"]//a[@href="/vcards/0/"]': '',
            '//a[@class="button merge-button"]': 'merge'
          },
          click: '//a[@class="button merge-button"]'
        },
        'merge form': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="headline"]': 'vcard Uwe Gerdes',
            '//form[@id="merge"]': '',
            '//form[@id="merge"]//*[@name="version"][@value="2.1"]': '',
            '//form[@id="merge"]//*[@name="version"][@value="3.0"]': ''
          },
          click: '//form[@id="merge"]//input[@type="submit"]'
        },
        'merge save': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="version"]//*[@class="itemvalue"]': '2.1',
            '//*[@id="n"]//*[@class="itemvalue"]': 'Gerdes, Uwe',
            '//*[@id="fn"]//*[@class="itemvalue"]': 'Uwe Gerdes',
            '//*[@id="tel"]//*[@class="itemvalue"]':
                  '040 256486 (Arbeit, Sprache)\n0179 3901008 (Mobil)\n' +
                  '+49 40 25178252 (Arbeit, Sprache)\n01793901008 (Mobil)',
            '//*[@id="adr"]//*[@class="itemvalue"]':
                  'Klaus-Groth-Str. 22, Hamburg, 20535, Germany (privat)'
          },
          click: '//a[@id="delButton"]'
        },
        'delete merged': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="version"]//*[@class="itemvalue"]': '2.1',
            '//*[@id="fn"]//*[@class="itemvalue"]': 'Uwe Gerdes',
            '//*[@id="tel"]//*[@class="itemvalue"]':
                  '040 256486 (Arbeit, Sprache)\n0179 3901008 (Mobil)\n' +
                  '+49 40 25178252 (Arbeit, Sprache)\n01793901008 (Mobil)'
          },
          elementsNotExist: [
            '//*[@id="list"]/li[2]',
            '//a[@id="delButton"]'
          ]
        }
        // TODO: add test for X-STATUS and X-TIMESTAMP
      }
    }
  }
}

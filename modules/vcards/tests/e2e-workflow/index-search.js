/**
 * Testdata for vcards
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://vcards-e2e:8080'

module.exports = {
  group: 'vCards E2E Test',
  name: 'Index + Suche',
  viewports: {
    'Mobile': { width: 340, height: 568 },
    'Tablet': { width: 768, height: 1024 },
    'Desktop': { width: 1200, height: 900 }
  },
  testCases: {
    'Index': {
      uri: domain + '/vcards/dataset/testdata',
      steps: {
        'start': {
          title: 'Webserver - vcard',
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
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="version"]//*[@class="field-value"]': '2.1',
            '//*[@id="fn"]//*[@class="field-value"]': 'Uwe Gerdes',
            '//*[@id="tel"]//*[@class="field-value"]':
              '040 256486 (Arbeit, Sprache)\n0179 3901008 (Mobil)',
            '//a[@id="editButton"]': ''
          },
          click: 'a[href="/vcards/1/"]'
        },
        'vcard 1': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="version"]//*[@class="field-value"]': '3.0'
          }
        }
      }
    },
    'Suche': {
      uri: domain + '/vcards/1/',
      steps: {
        'open vcard 1': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="version"]//*[@class="field-value"]': '3.0'
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
            '//a[@class="button open"]': 'öffnen'
          },
          click: '*[id="searchLayer"] a[href="/vcards/0/"]'
        },
        'search result: click vcard 0': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="version"]//*[@class="field-value"]': '2.1'
          },
          click: '#searchButton'
        },
        'search layer open again': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@class="search-headline"]': 'Suchen',
            '//form[@name="searchForm"]': '',
            '//form[@name="searchForm"]//*[@id="search_version"]': '',
            '//form[@name="searchForm"]//*[@for="search_version"]': 'Version'
          },
          input: {
            '//input[@name="searchFields"][@value="version"]': true,
            '//input[@name="searchString"]': '3'
          },
          click: 'input[type="submit"]'
        },
        'search result for version=3': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="searchLayer"]/div/h2': 'Suchen',
            '//a[@class="button open"]': 'öffnen',
            '//a[@class="button merge-button"]': 'merge',
            '//a[@href="/vcards/merge/0/1/"]': 'merge'
          },
          elementsNotExist: [
            '//*[@id="searchLayer"]//a[@href="/vcards/0/"]'
          ],
          click: '#searchAgain'
        },
        'search again': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@class="search-headline"]': 'Suchen',
            '//form[@name="searchForm"]': '',
            '//form[@name="searchForm"]//*[@id="search_version"]': '',
            '//form[@name="searchForm"]//*[@for="search_version"]': 'Version'
          },
          input: {
            '//input[@name="searchFields"][@value="n"]': true,
            '//input[@name="searchString"]': 'XXX'
          },
          click: 'input[type="submit"]'
        },
        'search result for name=XXX empty': {
          title: 'Webserver - vcard',
          elements: {
            '//*[@id="searchLayer"]/div/h2': 'Suchen'
          },
          elementsNotExist: [
            '//a[@class="button open"]',
            '//a[@class="button merge"]',
            '//*[@id="searchLayer"]//a[@href="/vcards/0/"]',
            '//*[@id="searchResult"]//ul//li'
          ]
        }
      }
    }
  }
}

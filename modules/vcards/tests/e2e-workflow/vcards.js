/**
 * Testdata for vcards
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

const domain = 'http://vcards-e2e:8080';

module.exports = {
  name: 'default e2e workflow test',
  dumpDir: './results/modules/vcards/',
  viewportSize: { width: 1500, height: 1024 },
  testCases: {
    'vcards': {
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
            '//*[@id="tel"]//*[@class="itemvalue"]':
              '040 256486 (Arbeit, Sprache)\n0179 3901008 (Mobil)',
            '//a[@id="editButton"]': '',
          },
        },
        'vcard 1': {
          title: 'Webserver - vcard',
          click: 'a[href="/vcards/1/"]',
          elements: {
            '//*[@id="version"]//*[@class="itemvalue"]': '3.0',
          },
        },
        'search layer': {
          title: 'Webserver - vcard',
          click: '#searchButton',
          elements: {
            '//*[@class="searchHeadline"]': 'Suchen',
            '//form[@name="searchForm"]': '',
            '//form[@name="searchForm"]//*[@id="search_version"]': '',
            '//form[@name="searchForm"]//*[@for="search_version"]': 'Version',
          }
        },
        'search result, no input': {
          title: 'Webserver - vcard',
          click: 'input[type="submit"]',
          elements: {
            '//*[@id="searchLayer"]/div/h2': 'Suchen',
            '//*[@id="searchLayer"]//a[@href="/vcards/0/"]': '',
            '//a[@class="button open"]': 'öffnen',
          },
        },
        'search result: click vcard 0': {
          title: 'Webserver - vcard',
          click: '*[id="searchLayer"] a[href="/vcards/0/"]',
          elements: {
            '//*[@id="version"]//*[@class="itemvalue"]': '2.1',
          },
        },
        'search layer open again': {
          title: 'Webserver - vcard',
          click: '#searchButton',
          elements: {
            '//*[@class="searchHeadline"]': 'Suchen',
            '//form[@name="searchForm"]': '',
            '//form[@name="searchForm"]//*[@id="search_version"]': '',
            '//form[@name="searchForm"]//*[@for="search_version"]': 'Version',
          }
        },
        'search result for version=3': {
          title: 'Webserver - vcard',
          input: {
            '//input[@name="searchFields"][@value="version"]': true,
            '//input[@name="searchString"]': '3',
          },
          click: 'input[type="submit"]',
          elements: {
            '//*[@id="searchLayer"]/div/h2': 'Suchen',
            '//a[@class="button open"]': 'öffnen',
            '//a[@class="button merge-button"]': 'merge',
            '//a[@href="/vcards/merge/0/1/"]': 'merge',
          },
          elementsNotExist: [
            '//*[@id="searchLayer"]//a[@href="/vcards/0/"]',
          ],
        },
        'search again': {
          title: 'Webserver - vcard',
          click: '#searchAgain',
          elements: {
            '//*[@class="searchHeadline"]': 'Suchen',
            '//form[@name="searchForm"]': '',
            '//form[@name="searchForm"]//*[@id="search_version"]': '',
            '//form[@name="searchForm"]//*[@for="search_version"]': 'Version',
          }
        },
        'search result for name=XXX empty': {
          title: 'Webserver - vcard',
          input: {
            '//input[@name="searchFields"][@value="n"]': true,
            '//input[@name="searchString"]': 'XXX',
          },
          click: 'input[type="submit"]',
          elements: {
            '//*[@id="searchLayer"]/div/h2': 'Suchen',
          },
          elementsNotExist: [
            '//a[@class="button open"]',
            '//a[@class="button merge"]',
            '//*[@id="searchLayer"]//a[@href="/vcards/0/"]',
            '//*[@id="searchResult"]//ul//li',
          ],
        },
      }
    }
  }
};


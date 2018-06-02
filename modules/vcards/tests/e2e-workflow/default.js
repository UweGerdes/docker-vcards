/**
 * Testdata for acteam Neukunden-Anmeldung und Datenbearbeitung
 *
 * (c) Uwe Gerdes, entwicklung@uwegerdes.de
 */

/* jshint esversion: 5, varstmt: false */

var domain = 'http://vcards:8080';
var testCases = [];

testCases.push(
  {
    name: 'vcard-index',
    uri: domain + '/vcards/',
    title: 'Webserver - vcard',
    steps: [
      {
        name: 'start',
        title: 'Webserver - vcard',
        elements: {
          '//h1[@class="headline"]': 'vcard'
        },
        elementsNotExist: [
          '//a[@class="editButton"]'
        ],
      }
      /**/
    ]
  }
);

module.exports = {
  name: 'default',
  dumpDir: './results/default/',
  viewportSize: { width: 850, height: 700 },
  testCases: testCases
};

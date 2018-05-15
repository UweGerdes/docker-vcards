/**
 * scripts for vcard
 */
'use strict';

/* jshint browser: true */

/**
 * toggle element by id
 */
function dataToggle() {
  console.log('toggle init');
}

if (window.attachEvent) {
  window.attachEvent('onload', dataToggle);
} else if (window.addEventListener) {
  window.addEventListener('load', dataToggle, false);
} else {
  document.addEventListener('load', dataToggle, false);
}

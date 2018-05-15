/**
 * scripts for vcard
 */
'use strict';

/* jshint browser: true */

/**
 * toggle element by id
 */
function dataToggle() {
  const elements = document.querySelectorAll('[data-toggle]');
  elements.forEach((element) => { // jscs:ignore jsDoc
    element.addEventListener('click', () => { // jscs:ignore jsDoc
      const toggleList = document.querySelectorAll(element.dataset.toggle);
      toggleList.forEach((toggled) => { // jscs:ignore jsDoc
        toggled.classList.toggle('hidden');
      });
    });
  });
}

if (window.attachEvent) {
  window.attachEvent('onload', dataToggle);
} else if (window.addEventListener) {
  window.addEventListener('load', dataToggle, false);
} else {
  document.addEventListener('load', dataToggle, false);
}

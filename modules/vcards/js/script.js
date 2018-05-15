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
    const toggleList = document.querySelectorAll(element.dataset.toggle);
    element.addEventListener('click', () => { // jscs:ignore jsDoc
      toggleList.forEach((toggled) => { // jscs:ignore jsDoc
        toggled.classList.toggle('hidden');
      });
    });
    toggleList.forEach((toggled) => { // jscs:ignore jsDoc
      toggled.addEventListener('click', () => { // jscs:ignore jsDoc
        console.log('toggled clicked');
        toggled.classList.toggle('hidden');
      });
      toggled.childNodes.forEach((child) => { // jscs:ignore jsDoc
        child.addEventListener('click', (event) => { // jscs:ignore jsDoc
          console.log('child clicked');
          event.stopPropagation();
        });
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

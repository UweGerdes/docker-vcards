/**
 * scripts for vcard
 */
'use strict';

/* jshint browser: true */

let handlers = [];

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
        toggled.classList.toggle('hidden');
      });
      toggled.childNodes.forEach((child) => { // jscs:ignore jsDoc
        child.addEventListener('click', (event) => { // jscs:ignore jsDoc
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

/**
 * searchSubmit
 */
handlers.push({
  selector: '#searchForm',
  event: 'submit',
  func: (event) => { // jscs:ignore jsDoc
    event.preventDefault();
    const form = document.getElementById('searchForm');
    const formData = new FormData(form);
    console.log('formData', formData);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { // jscs:ignore jsDoc
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('searchResult').innerHTML = this.responseText;
      }
    };
    xhttp.open('POST', '/vcards/search/', true);
    xhttp.send(formData);
  }
});

handlers.forEach((handler) => { // jscs:ignore jsDoc
  const elements = document.querySelectorAll(handler.selector);
  elements.forEach((element) => { // jscs:ignore jsDoc
    element.addEventListener(handler.event, handler.func, false);
  });
});

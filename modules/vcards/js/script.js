/**
 * scripts for vcard
 */
'use strict';

/* jshint browser: true */

let handlers = [];

/**
 * toggle element by id
 */
handlers.push({
  elements: [window],
  event: 'load',
  func: () => { // jscs:ignore jsDoc
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
});

/**
 * searchSubmit
 */
handlers.push({
  elements: document.querySelectorAll('#searchForm'),
  event: 'submit',
  func: (event) => { // jscs:ignore jsDoc
    event.preventDefault();
    const form = document.getElementById('searchForm');
    const formData = new FormData(form);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { // jscs:ignore jsDoc
      if (this.readyState == 4) {
        document.getElementById('searchResult').innerHTML = '';
        document.getElementById('searchErrors').innerHTML = '';
        if (this.status == 200) {
          document.getElementById('searchResult').innerHTML = this.responseText;
          form.classList.add('hidden');
        }
        if (this.status == 404) {
          document.getElementById('searchErrors').innerHTML = this.responseText;
        }
      }
    };
    xhttp.open('POST', '/vcards/search/', true);
    xhttp.send(formData);
  }
});

/**
 * attach event handlers
 */
handlers.forEach((handler) => { // jscs:ignore jsDoc
  handler.elements.forEach((element) => { // jscs:ignore jsDoc
    if (element.attachEvent) {
      element.attachEvent('on' + handler.event, handler.func);
    } else if (element.addEventListener) {
      element.addEventListener(handler.event, handler.func, false);
    } else {
      element.addEventListener(handler.event, handler.func, false);
    }
  });
});


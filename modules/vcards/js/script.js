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
        if (toggled != element) {
          toggled.addEventListener('click', () => { // jscs:ignore jsDoc
            toggled.classList.toggle('hidden');
          });
          toggled.childNodes.forEach((child) => { // jscs:ignore jsDoc
            child.addEventListener('click', (event) => { // jscs:ignore jsDoc
              event.stopPropagation();
            });
          });
        }
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
    const searchFieldList = [];
    document.searchForm.searchFields.forEach((field) => { // jscs:ignore jsDoc
      if (field.checked) {
        searchFieldList.push(field.value);
      }
    });
    document.getElementById('searchInfo').innerHTML =
      '"' + document.searchForm.searchString.value + '" in ' + searchFieldList.join(', ');
    document.getElementById('searchInfo').classList.remove('hidden');
    document.getElementById('searchAgain').classList.remove('hidden');
    xhttp.open('POST', '/vcards/search/', true);
    xhttp.send(formData);
  }
});

/**
 * new type
 *
 * @param {Event} event - triggered event
 */
function newType(event) {
  const element = event.target;
  if (element.value != '') {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { // jscs:ignore jsDoc
      if (this.readyState == 4) {
        if (this.status == 200) {
          element.insertAdjacentHTML('beforebegin', this.responseText);
          element.remove(element.selectedIndex);
          element.selectedIndex = 0;
        }
      }
    };
    xhttp.open('GET', element.getAttribute('data-select-xhr') + element.value, true);
    xhttp.send();
  }
}
handlers.push({
  elements: document.querySelectorAll('select[data-select-xhr]'),
  event: 'change',
  func: newType
});

/**
 * new input
 */
handlers.push({
  elements: document.querySelectorAll('[data-click-xhr]'),
  event: 'click',
  func: function () { // jscs:ignore jsDoc
    const _this = this;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () { // jscs:ignore jsDoc
      if (this.readyState == 4) {
        if (this.status == 200) {
          _this.parentElement.insertAdjacentHTML('beforeend', this.responseText);
          const selects = _this.parentElement.querySelectorAll('select[data-select-xhr]');
          attachEventHandler(selects[selects.length - 1], 'change', newType);
        }
      }
    };
    const newIndex = _this.parentElement.querySelectorAll('.input-text').length;
    xhttp.open('GET', this.getAttribute('data-click-xhr') + newIndex, true);
    xhttp.send();
  }
});

/**
 * attach event to elements
 *
 * @param {DOMelement} element - to attach event
 * @param {string} event - type
 * @param {function} handler - event handler
 */
function attachEventHandler(element, event, handler) {
  if (element.attachEvent) {
    element.attachEvent('on' + event, handler);
  } else if (element.addEventListener) {
    element.addEventListener(event, handler, false);
  } else {
    element.addEventListener(event, handler, false);
  }
}

/**
 * attach event handlers
 */
handlers.forEach((handler) => { // jscs:ignore jsDoc
  handler.elements.forEach((element) => { // jscs:ignore jsDoc
    attachEventHandler(element, handler.event, handler.func);
  });
});

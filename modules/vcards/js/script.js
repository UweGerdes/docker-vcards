/**
 * scripts for vcard
 */

'use strict';

let handler = {};

/**
 * open modal
 */
handler['data-modal'] = {
  elements: [window],
  event: 'load',
  func: () => {
    const elements = document.querySelectorAll('[data-modal]');
    elements.forEach((element) => {
      const toggleList = document.querySelectorAll(element.dataset.modal);
      element.addEventListener('click', () => {
        toggleList.forEach((toggled) => {
          toggled.classList.remove('hidden');
        });
        document.getElementById('footer').classList.add('hidden');
        document.getElementById('page').classList.add('modalOpen');
      });
      toggleList.forEach((toggled) => {
        if (toggled !== element) {
          toggled.addEventListener('click', () => {
            toggled.classList.add('hidden');
            document.getElementById('footer').classList.remove('hidden');
            document.getElementById('page').classList.remove('modalOpen');
          });
          toggled.childNodes.forEach((child) => {
            child.addEventListener('click', (event) => {
              event.stopPropagation();
            });
          });
        }
      });
    });
  }
};

/**
 * searchSubmit
 */
handler['searchForm-submit'] = {
  elements: document.querySelectorAll('#searchForm'),
  event: 'submit',
  func: (event) => {
    event.preventDefault();
    const form = document.getElementById('searchForm');
    const formData = new FormData(form);
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        document.getElementById('searchResult').innerHTML = '';
        document.getElementById('searchErrors').innerHTML = '';
        if (this.status === 200) {
          document.getElementById('searchResult').innerHTML = this.responseText;
          document.getElementById('searchResult').classList.remove('hidden');
          form.classList.add('hidden');
        }
        if (this.status === 404) {
          document.getElementById('searchErrors').innerHTML = this.responseText;
        }
      }
    };
    const searchFieldList = [];
    document.searchForm.searchFields.forEach((field) => {
      if (field.checked) {
        searchFieldList.push(field.nextSibling.textContent);
      }
    });
    document.getElementById('searchInfo').innerHTML =
      '"' + document.searchForm.searchString.value + '" in ' + searchFieldList.join(', ');
    document.getElementById('searchInfo').classList.remove('hidden');
    document.getElementById('searchAgain').classList.remove('hidden');
    xhttp.open('POST', form.action, true);
    xhttp.send(formData);
  }
};

/**
 * new type
 *
 * @param {Event} event - triggered event
 */
handler['data-select-xhr'] = {
  elements: document.querySelectorAll('select[data-select-xhr]'),
  event: 'change',
  func: (event) => {
    const element = event.target;
    if (element.value !== '') {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          if (this.status === 200) {
            element.insertAdjacentHTML('beforeBegin', this.responseText);
            element.remove(element.selectedIndex);
            element.selectedIndex = 0;
            const selects = element.previousSibling.querySelectorAll('select[data-select-xhr]');
            if (selects.length) {
              attachEventHandler(
                selects[selects.length - 1],
                'change',
                handler['data-select-xhr'].func
              );
            }
            const clickButton = element.previousSibling.querySelectorAll('span[data-click-xhr]');
            if (clickButton.length) {
              attachEventHandler(clickButton[0], 'click', handler['data-click-xhr'].func);
            }
            const fileInputLabel = element.previousSibling.querySelectorAll('[data-filename-from]');
            if (fileInputLabel.length) {
              console.log(fileInputLabel[0]);
              attachEventHandler(
                element.previousSibling.querySelectorAll('input[type="file"]')[0],
                handler['data-filename-from'].event,
                handler['data-filename-from'].func
              );
            }
          }
        }
      };
      let i = element.parentNode.getElementsByClassName('type').length + element.selectedIndex - 1;
      xhttp.open('GET', element.getAttribute('data-select-xhr') + element.value + '/' + i, true);
      xhttp.send();
    }
  }
};

/**
 * new input
 */
handler['data-click-xhr'] = {
  elements: document.querySelectorAll('[data-click-xhr]'),
  event: 'click',
  func: function (event) {
    const element = event.target;
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          element.insertAdjacentHTML('beforeBegin', this.responseText);
          const selects = element.previousSibling.querySelectorAll('select[data-select-xhr]');
          if (selects.length) {
            attachEventHandler(
              selects[selects.length - 1],
              'change',
              handler['data-select-xhr'].func
            );
          }
        }
      }
    };
    const newIndex = element.parentElement.querySelectorAll(':scope > input').length;
    xhttp.open('GET', element.getAttribute('data-click-xhr') + newIndex, true);
    xhttp.send();
  }
};

/**
 * open url from selection
 */
handler['data-select-url'] = {
  elements: document.querySelectorAll('[data-select-url]'),
  event: 'change',
  func: function (event) {
    const element = event.target;
    const value = element[element.selectedIndex].value;
    console.log('open', element.getAttribute('data-select-url') + value);
    document.location.href = element.getAttribute('data-select-url') + value;
  }
};

/**
 * open url from selection
 */
handler['data-open-url'] = {
  elements: document.querySelectorAll('[data-open-url]'),
  event: 'click',
  func: function (event) {
    const element = event.target;
    document.location.href = element.getAttribute('data-open-url');
  }
};

/**
 * open url from selection
 */
handler['data-filename-from'] = {
  elements: document.querySelectorAll('input[type="file"]'),
  event: 'change',
  func: function (event) {
    const element = event.target;
    if (element.id) {
      const filename = element.value.replace(/^.*(\\|\/)/, '');
      const labelElements = document.querySelectorAll('[data-filename-from="' + element.id + '"]');
      labelElements.forEach(el => {
        el.innerText = 'Datei: ' + filename;
      });
    }
  }
};

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
Object.values(handler).forEach((handler) => {
  handler.elements.forEach((element) => {
    attachEventHandler(element, handler.event, handler.func);
  });
});

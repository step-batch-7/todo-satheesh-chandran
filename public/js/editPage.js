const requestForClickedElement = function(url, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    callback(JSON.parse(this.responseText));
  };
  req.open('GET', url);
  req.send();
};

const getTableRowTemplate = function({ name, id, status }) {
  const toTdElements = () => `<td><input type="checkbox"/></td>
  <td>${name}</td><td><button>delete</button></td>`;

  const tableRow = document.createElement('tr');
  tableRow.innerHTML = toTdElements();
  tableRow.querySelector('td input').checked = status;
  document.querySelector('#list-table tbody').appendChild(tableRow);
};

const appendTableRow = function(element) {
  document.querySelector('body p').innerText = element.name;
  const tasks = element.tasks;
  tasks.forEach(getTableRowTemplate);
};

const main = function() {
  requestForClickedElement('/tasks', appendTableRow);
};
window.onload = main;

// `<tr>
//  <td><input type="checkbox" /></td>
//  <td>sruthy</td>
//  <td><button>delete</button></td>
//  </tr>`;

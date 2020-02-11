/* eslint-disable no-extra-parens */
// const appendChildHTML = (selector, html) => {
//   const temp = document.createElement('div');
//   temp.innerHTML = html;
//   document.querySelector(selector).appendChild(temp.firstChild);
// };

const sendIdToServer = id => sendPostRequest('tasks', id);

const getListRows = function(todos) {
  const toTodoRow = ({ id, name }) =>
    `<tr><td><a href="./editPage.html?todoId=${id}">${name}</a></td>
    <td id="${id}"><button onclick="deleteList()">delete</button></td></tr>`;

  return todos.map(toTodoRow).join('\n');
};

const getTaskRows = function(todos) {
  const toTaskRow = ({ id, name, tasks }) => {
    const todoName = name;
    const toRow = ({ name }) => `<tr><td>${name}</td>
    <td><a href="./editPage.html?todoId=${id}">${todoName}</a></td></tr>`;
    return tasks.map(toRow).join('\n');
  };
  const taskRows = todos.map(toTaskRow);
  return taskRows;
};

const updateTodosOnPage = function(todos) {
  const trsHTML = getListRows(todos);
  const listHTML = getTaskRows(todos);
  document.querySelector('#list-table tbody').innerHTML = trsHTML;
  document.querySelector('.list-table tbody').innerHTML = listHTML.join('\n');
};

const getJSONFromServer = (url, callback) => {
  const req = new XMLHttpRequest();
  req.onload = function() {
    callback(JSON.parse(this.response));
  };
  req.open('GET', url);
  req.send();
};

const sendPostRequest = function(url, content) {
  const req = new XMLHttpRequest();
  req.open('POST', url);
  req.send(content);
};

const deleteList = function() {
  const target = event.currentTarget;
  const parent = target.parentElement;
  const id = parent.getAttribute('id');
  sendPostRequest('/delete', id);
  getJSONFromServer('todos', updateTodosOnPage);
};

const main = () => {
  getJSONFromServer('todos', updateTodosOnPage);
};

window.onload = main;

/////////////////////////////////////////////////

const toggleSearchBar = function() {
  if (document.querySelector('#check').checked) {
    document.querySelector('#todo').classList.add('invisible');
    return document.querySelector('#task').classList.remove('invisible');
  }
  document.querySelector('#todo').classList.remove('invisible');
  document.querySelector('#task').classList.add('invisible');
};

const showMatched = function(searchValue, rows) {
  const matchValue = row => {
    if (row.textContent.match(searchValue)) {
      row.style.display = '';
    }
  };
  rows.forEach(matchValue);
};

const filterMatchedList = function() {
  const searchValue = event.target.value;
  const tableRows = Array.from(document.querySelector('tbody').children);

  if (searchValue !== '') {
    tableRows.forEach(row => (row.style.display = 'none'));
    return showMatched(searchValue, tableRows);
  }
  tableRows.forEach(row => (row.style.display = ''));
};

const filterMatchedTask = function() {
  const searchValue = event.target.value;
  const tableRows = Array.from(
    document.querySelector('.list-table tbody').children
  );
  if (searchValue !== '') {
    document.querySelector('.innerBox').classList.add('hide');
    document.querySelector('.hiddenBox').classList.remove('hide');
    tableRows.forEach(row => (row.style.display = 'none'));
    return showMatched(searchValue, tableRows);
  }
  tableRows.forEach(row => (row.style.display = ''));
  document.querySelector('.innerBox').classList.remove('hide');
  document.querySelector('.hiddenBox').classList.add('hide');
};

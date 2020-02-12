/* eslint-disable no-extra-parens */
// const appendChildHTML = (selector, html) => {
//   const temp = document.createElement('div');
//   temp.innerHTML = html;
//   document.querySelector(selector).appendChild(temp.firstChild);
// };

const sendIdToServer = id => sendPostRequest('tasks', id);

const generateTodos = function(html, { id, name }) {
  const todo = `<tr><td><a href="./editPage.html?todoId=${id}">${name}</a></td>
  <td id="${id}"><button onclick="deleteList()">delete</button></td></tr>`;
  return html + todo;
};

const generateTodosWithTasks = function(html, { id, name, tasks }) {
  const toTaskHtml = function(html, task) {
    const taskHtml = `<tr><td>${task.name}</td>
      <td><a href="./editPage.html?todoId=${id}">${name}</a></td></tr>`;
    return html + taskHtml;
  };
  return html + tasks.reduce(toTaskHtml, '');
};

const updateTodosOnPage = function(todos) {
  const trsHTML = todos.reduce(generateTodos, '');
  const listHTML = todos.reduce(generateTodosWithTasks, '');
  document.querySelector('#list-table tbody').innerHTML = trsHTML;
  document.querySelector('.list-table tbody').innerHTML = listHTML;
};

const getJSONFromServer = (url, callback) => {
  const req = new XMLHttpRequest();
  req.onload = function() {
    callback(JSON.parse(this.response));
  };
  req.open('GET', url);
  req.send();
};

const sendXHR = function(method, url, callback, message = '') {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200) {
      callback(JSON.parse(this.responseText));
    }
  };
  req.open(method, url);
  req.send(message);
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
  sendXHR('GET', '/todos', updateTodosOnPage);
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

const addNewTodo = function() {
  const target = event.target;
  if (event.key === 'Enter' && target.value.trim() !== '') {
    const body = JSON.stringify({ name: target.value });
    sendXHR('POST', 'addNewTodo', updateTodosOnPage, body);
    target.value = '';
  }
};

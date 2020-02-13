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
  const todoHTML = todos.reduce(generateTodos, '');
  const taskHTML = todos.reduce(generateTodosWithTasks, '');
  document.querySelector('#list-table tbody').innerHTML = todoHTML;
  document.querySelector('.list-table tbody').innerHTML = taskHTML;
};

const sendXHR = function(method, url, callback, message = '') {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200) {
      callback(JSON.parse(this.responseText));
    }
  };
  req.open(method, url);
  method === 'POST' && req.setRequestHeader('Content-type', 'application/json');
  req.send(message);
};

const deleteList = function() {
  const [, parent] = event.path;
  const id = parent.id;
  sendXHR('POST', '/delete', updateTodosOnPage, `{ "id": "${id}" }`);
};

const addNewTodo = function() {
  const target = event.target;
  if (event.key === 'Enter' && target.value.trim() !== '') {
    const body = JSON.stringify({ name: target.value });
    sendXHR('POST', 'addNewTodo', updateTodosOnPage, body);
    target.value = '';
  }
};

const main = () => {
  sendXHR('GET', '/todos', updateTodosOnPage);
};

window.onload = main;

/////////////////////////////////////////////////

const search = function() {
  const target = event.target;
  const selector = document.querySelector('#selector');
  const searcher = selector.value === 'title' ? searchByTodo : searchByTask;
  searcher(target.value);
};

const showMatched = function(value, rows) {
  const regEx = new RegExp(`${value}`, 'i');
  const matched = rows.filter(row => row.textContent.match(regEx));
  matched.forEach(row => row.classList.remove('hide'));
};

const searchByTodo = function(text) {
  const rows = Array.from(document.querySelector('tbody').children);
  rows.forEach(row => row.classList.add('hide'));
  showMatched(event.target.value, rows);
};

const toggleHideTable = function(text) {
  if (text === '') {
    document.querySelector('.innerBox').classList.remove('hide');
    return document.querySelector('.hiddenBox').classList.add('hide');
  }
  document.querySelector('.innerBox').classList.add('hide');
  document.querySelector('.hiddenBox').classList.remove('hide');
};

const searchByTask = function(text) {
  const rows = Array.from(document.querySelector('.list-table tbody').children);
  toggleHideTable(text);
  rows.forEach(row => row.classList.add('hide'));
  showMatched(text, rows);
};

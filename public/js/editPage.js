const deleteTableRow = function(taskId) {
  const todoId = document.querySelector('h3').id;
  const body = { taskId, todoId };
  sendXHR('POST', 'deleteTask', appendTableRow, JSON.stringify(body));
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

const getTableRowTemplate = function({ name, id, status }) {
  const attribute = status ? 'checked' : '';
  const row = `<tr id="${id}"><td><input type="checkbox" ${attribute}/></td>
    <td onclick="popUpEditWindow()" style="cursor: pointer;">${name}</td>
    <td><button onclick="deleteTableRow('${id}')">delete</button></td></tr>`;
  return appendHtmlToDom('#list-table tbody', row);
};

const appendHtmlToDom = function(selector, html) {
  const tbody = document.createElement('tbody');
  tbody.innerHTML = html;
  document.querySelector(selector).appendChild(tbody.firstChild);
};

const appendTableRow = function(todoList) {
  document.querySelector('#list-table tbody').innerHTML = '';
  const title = document.querySelector('body h3');
  title.innerText = todoList.name;
  title.id = todoList.id;
  todoList.tasks.forEach(getTableRowTemplate);
};

const main = function() {
  sendXHR('GET', '/tasks', appendTableRow);
};

window.onload = main;

/////////////////////////////////////////////////

const parseLists = function(task) {
  const list = {};
  list.status = task.querySelector('td input').checked;
  list.name = task.children[1].innerText;
  list.id = task.getAttribute('id');
  return list;
};

const submitLists = function() {
  const tasks = Array.from(
    document.querySelector('#list-table tbody').children
  );
  document.querySelector('#list-table tbody').innerHTML = '';
  const modifiedTasks = tasks.map(parseLists);
  const modifiedLists = {
    tasks: modifiedTasks,
    id: document.querySelector('body h3').getAttribute('id'),
    name: document.querySelector('h3').innerText
  };
  sendXHR('POST', '/editedList', appendTableRow, JSON.stringify(modifiedLists));
};

/////////////////////////////////////////////////

const addNewTasks = function(event) {
  const inputTag = document.querySelector('#title-bar');
  if (event.key === 'Enter' && inputTag.value.trim() !== '') {
    const taskName = inputTag.value;
    inputTag.value = '';
    const todoId = document.querySelector('h3').id;
    const body = JSON.stringify({ taskName, todoId });
    sendXHR('POST', 'newTask', appendTableRow, body);
  }
};

/////////////////////////////////////////////////

const replaceName = function(target, inputTag) {
  if (event.key === 'Enter' && inputTag.value.trim() !== '') {
    const newName = inputTag.value;
    target.innerText = newName;
    submitLists();
    document.querySelector('.popUp-window').style.visibility = 'hidden';
    document.querySelector('.lists').classList.remove('invisible');
    document.querySelector('a input').classList.remove('invisible');
    document.querySelector('a').style.pointerEvents = 'auto';
  }
};

const popUpEditWindow = function() {
  const inputTag = document.querySelector('.popUp-window input');
  document.querySelector('.popUp-window').style.visibility = 'visible';
  document.querySelector('.lists').classList.add('invisible');
  document.querySelector('a input').classList.add('invisible');
  document.querySelector('a').style.pointerEvents = 'none';
  const currentTarget = event.currentTarget;
  inputTag.value = currentTarget.innerHTML;
  inputTag.onkeydown = () => replaceName(currentTarget, inputTag);
};

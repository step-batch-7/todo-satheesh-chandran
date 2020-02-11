const deleteTableRow = function(id) {
  const selectedRow = document.getElementById(id);
  document.querySelector('#list-table tbody').removeChild(selectedRow);
  submitLists();
};

const requestForElement = function(url, callback) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    callback(JSON.parse(this.responseText));
  };
  req.open('GET', url);
  req.send();
};

const getTableRowTemplate = function({ name, id, status }) {
  const attribute = status ? 'checked' : '';
  const toTdElements = () => `<td><input type="checkbox" ${attribute}/></td>
    <td onclick="popUpEditWindow()" style="cursor: pointer;">${name}</td>
    <td><button onclick="deleteTableRow('${id}')">delete</button></td>`;

  const tableRow = document.createElement('tr');
  tableRow.setAttribute('id', id);
  tableRow.innerHTML = toTdElements();
  document.querySelector('#list-table tbody').appendChild(tableRow);
};

const appendTableRow = function(todoList) {
  document.querySelector('body h3').innerText = todoList.name;
  document.querySelector('body h3').id = todoList.id;
  todoList.tasks.forEach(getTableRowTemplate);
};

const main = function() {
  requestForElement('/tasks', appendTableRow);
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

const sendModifiedList = function(url, content) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    appendTableRow(JSON.parse(this.responseText));
  };
  req.open('POST', url);
  req.send(content);
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
    name: document.querySelector('h3 span').innerText
  };
  sendModifiedList('/editedList', JSON.stringify(modifiedLists));
};

/////////////////////////////////////////////////

const sendAddedTask = function(url, content) {
  const req = new XMLHttpRequest();
  req.onload = function() {
    getTableRowTemplate(JSON.parse(this.responseText));
  };
  req.open('POST', url);
  req.send(content);
};

const getLastRableRowId = function() {
  const tableRows = Array.from(document.querySelector('tbody').children);
  if (tableRows.length > 0) {
    return tableRows[tableRows.length - 1].getAttribute('id');
  }
  return `${document.querySelector('h3').getAttribute('id')}_-1`;
};

const addNewTasks = function(event) {
  const inputTag = document.querySelector('#title-bar');
  if (event.key === 'Enter' && inputTag.value.trim() !== '') {
    const taskName = inputTag.value;
    inputTag.value = '';
    const lastTaskId = getLastRableRowId();
    const addedTask = { taskName: taskName, lastTaskId: lastTaskId };
    sendAddedTask('newTask', JSON.stringify(addedTask));
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

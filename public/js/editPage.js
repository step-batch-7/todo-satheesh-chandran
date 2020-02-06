const deleteTableRow = function(id) {
  const selectedRow = document.getElementById(id);
  document.querySelector('#list-table tbody').removeChild(selectedRow);
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
  const toTdElements = () => `<td><input type="checkbox"/></td><td>${name}</td>
  <td><button onclick="deleteTableRow('${id}')">delete</button></td>`;

  const tableRow = document.createElement('tr');
  tableRow.setAttribute('id', id);
  tableRow.innerHTML = toTdElements();
  tableRow.querySelector('td input').checked = status;
  document.querySelector('#list-table tbody').appendChild(tableRow);
};

const appendTableRow = function(todoList) {
  document.querySelector('body p').innerText = todoList.name;
  document.querySelector('body p').setAttribute('id', todoList.id);
  const tasks = todoList.tasks;
  tasks.forEach(getTableRowTemplate);
};

const main = function() {
  requestForElement('/tasks', appendTableRow);
};

window.onload = main;

// `<tr>
//  <td><input type="checkbox" /></td>
//  <td>sruthy</td>
//  <td><button>delete</button></td>
//  </tr>`;

const parseLists = function(task) {
  const list = {};
  list.status = task.querySelector('td input').checked;
  list.name = task.children[1].innerText;
  list.id = task.getAttribute('id');
  return list;
};

const sendModifiedList = function(url, content) {
  const req = new XMLHttpRequest();
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
    id: document.querySelector('body p').getAttribute('id')
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
  return `${document.querySelector('p').getAttribute('id')}_-1`;
};

const addNewTasks = function(event) {
  if (event.key === 'Enter') {
    const taskName = document.querySelector('#title-bar').value;
    document.querySelector('#title-bar').value = '';

    const lastTaskId = getLastRableRowId();
    sendAddedTask(
      'newTask',
      JSON.stringify({ taskName: taskName, lastTaskId: lastTaskId })
    );
  }
};

const makeVisible = function() {
  const inputBar = document.querySelector('#item-bar');
  document.querySelector('div button').style.visibility = 'hidden';
  inputBar.style.visibility = 'visible';
};

const getTableRowChild = function(taskName) {
  const toHTML = taskName =>
    `<td><input type="checkbox"/></td><td>${taskName}</td>`;

  const tableRow = document.createElement('tr');
  tableRow.innerHTML = toHTML(taskName);
  return tableRow;
};

const addTasks = function(event) {
  const target = event.currentTarget;
  if (event.key === 'Enter' && target.value.trim() !== '') {
    const value = target.value;
    target.value = '';
    const tableRow = getTableRowChild(value);
    document.querySelector('#list-table tbody').appendChild(tableRow);
    // document.querySelector('#item-bar').style.visibility = 'hidden';
  }
};

const parseLists = function(task) {
  const list = {};
  const children = Array.from(task.children);
  const status = children[0].children[0].checked;
  list.status = status;
  list.name = children[1].innerText;
  return list;
};

const sendAddedLists = function(url, content) {
  const req = new XMLHttpRequest();
  req.open('POST', url);
  req.send(content);
};

const getTableTemplate = () =>
  '<thead><tr><th>Status</th><th>Items</th></tr></thead><tbody></tbody>';

const submitLists = function() {
  const items = Array.from(
    document.querySelector('#list-table tbody').children
  );
  document.querySelector('#list-table').innerHTML = getTableTemplate();
  const tasks = Array.from(items.map(parseLists));
  const title = document.querySelector('#title-bar').value;
  document.querySelector('#title-bar').value = '';
  const toDoList = {
    tasks: tasks,
    name: title
  };
  sendAddedLists('/addNewTodo', JSON.stringify(toDoList));
};

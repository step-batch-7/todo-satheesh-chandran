// const appendChildHTML = (selector, html) => {
//   const temp = document.createElement('div');
//   temp.innerHTML = html;
//   document.querySelector(selector).appendChild(temp.firstChild);
// };

const sendIdToServer = id => sendPostRequest('tasks', id);

const updateTodosOnPage = function(todos) {
  const toRow = ({ id, name }) =>
    `<tr><td>
    <a href="./editPage.html" onclick="sendIdToServer(${id})">${name}</a></td>
    <td id="${id}"><button onclick="deleteList()">delete</button></td></tr>`;

  const trsHTML = todos.todoLists.map(toRow).join('\n');
  document.querySelector('#list-table tbody').innerHTML = trsHTML;
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

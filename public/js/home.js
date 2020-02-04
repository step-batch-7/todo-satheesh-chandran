// const appendChildHTML = (selector, html) => {
//   const temp = document.createElement('div');
//   temp.innerHTML = html;
//   document.querySelector(selector).appendChild(temp.firstChild);
// };

const updateTodosOnPage = function(todos) {
  const toRow = ({ id, name }) =>
    `<tr><td onclick="viewTodo(${id})">${name}</td>
    <td id="${id}"><button onclick="deleteList()">delete</button></td></tr>`;

  const trsHTML = todos.map(toRow).join('\n');
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
  getJSONFromServer('list', updateTodosOnPage);
};

const main = () => {
  getJSONFromServer('list', updateTodosOnPage);
};

window.onload = main;

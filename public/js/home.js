const createInnerHTML = function(name) {
  return `<td>${name}</td>
  <td>
  <a href="./home.html">
  <button onclick="deleteList(event)">Delete</button></a>&emsp;
  <a href="./editPage.html"><button>Edit</button></a>
  </td>`;
};

const appendChild = function(list) {
  const tableRow = document.createElement('tr');
  tableRow.setAttribute('id', list.id);
  tableRow.innerHTML = createInnerHTML(list.name);
  document.querySelector('#list-table').appendChild(tableRow);
};

const sendGetRequest = function() {
  const req = new XMLHttpRequest();
  req.onload = function() {
    const content = JSON.parse(this.response);
    content.map(appendChild);
  };
  req.open('GET', '/list');
  req.send();
};

const sendPostRequest = function(url, content) {
  const req = new XMLHttpRequest();
  req.open('POST', url);
  req.send(content);
};

const deleteList = function(event) {
  const target = event.currentTarget;
  const parent = target.parentElement.parentElement.parentElement;
  const id = parent.getAttribute('id');
  sendPostRequest('/delete', id);
  sendGetRequest();
};

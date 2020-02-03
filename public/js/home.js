const createInnerHTML = function(name) {
  return `<td>${name}</td>
            <td>
              <button>Delete</button>&emsp;<a href="./editPage.html"
                ><button>Edit</button></a
              >
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

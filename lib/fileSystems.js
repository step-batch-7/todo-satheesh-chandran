const fs = require('fs');

const LIST_STORE = './data/todo.json';

const loadTodos = function() {
  if (!fs.existsSync(LIST_STORE)) {
    return '[]';
  }
  const contents = fs.readFileSync(LIST_STORE, 'utf8');
  if (contents === '') {
    return '[]';
  }
  return contents;
};

const setPath = function(req) {
  let path = `${__dirname}/../public${req.url}`;
  if (req.url === '/') {
    path = `${__dirname}/../public/home.html`;
  }
  return path;
};

module.exports = { loadTodos, setPath };

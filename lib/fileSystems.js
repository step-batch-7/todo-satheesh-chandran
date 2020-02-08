const fs = require('fs');
const { env } = require('process');

const { getDataStorePath } = require('../config');

// const LIST_STORE = './data/todo.json';
const LIST_STORE = getDataStorePath(env);

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

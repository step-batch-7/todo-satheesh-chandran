const fs = require('fs');
const { env } = require('process');

const { getDataStorePath } = require('../config');

const LIST_STORE = getDataStorePath(env);

const loadTodos = function() {
  if (!fs.existsSync(LIST_STORE)) {
    // return '{}';
    return '[]';
  }
  const contents = fs.readFileSync(LIST_STORE, 'utf8');
  return contents || '[]';
};

const setPath = function(url) {
  const page = url === '/' ? 'home.html' : url;
  return `${__dirname}/../public/${page}`;
};

module.exports = { loadTodos, setPath };

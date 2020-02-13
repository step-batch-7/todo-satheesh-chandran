const fs = require('fs');

const { DATA_STORE } = require('../config');

const loadTodos = function() {
  if (!fs.existsSync(DATA_STORE)) {
    return '[]';
  }
  const contents = fs.readFileSync(DATA_STORE, 'utf8');
  return contents || '[]';
};

const setPath = function(url) {
  const page = url === '/' ? 'home.html' : url;
  return `${__dirname}/../public/${page}`;
};

module.exports = { loadTodos, setPath };

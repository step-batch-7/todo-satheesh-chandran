const fs = require('fs');

const { DATA_STORE, SESSION_STORE } = require('../config');

const readFile = function(path) {
  if (!fs.existsSync(path)) {
    return '{}';
  }
  const contents = fs.readFileSync(path, 'utf8');
  return contents || '{}';
};

const loadTodos = readFile.bind(null, DATA_STORE);
const loadSessions = readFile.bind(null, SESSION_STORE);

const writeTodoLists = content => fs.writeFileSync(DATA_STORE, content);

module.exports = { loadTodos, writeTodoLists, loadSessions };

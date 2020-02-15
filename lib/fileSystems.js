const fs = require('fs');

const { DATA_STORE, SESSION_STORE, CREDENTIALS_STORE } = require('../config');

const readFile = function(path) {
  if (!fs.existsSync(path)) {
    return '{}';
  }
  const contents = fs.readFileSync(path, 'utf8');
  return contents || '{}';
};

const loadTodos = readFile.bind(null, DATA_STORE);
const loadSessions = readFile.bind(null, SESSION_STORE);
const loadCredentials = readFile.bind(null, CREDENTIALS_STORE);

const writeFile = (path, content) => fs.writeFileSync(path, content);
const writeTodoLists = writeFile.bind(null, DATA_STORE);
const writeUserCredentials = writeFile.bind(null, SESSION_STORE);
const writeSessions = writeFile.bind(null, SESSION_STORE);

module.exports = {
  loadCredentials,
  loadTodos,
  writeTodoLists,
  loadSessions,
  writeUserCredentials,
  writeSessions
};

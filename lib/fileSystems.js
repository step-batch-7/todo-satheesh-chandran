const fs = require('fs');

const { DATA_STORE, CREDENTIALS_STORE } = require('../config');

const readFile = function(path) {
  if (!fs.existsSync(path)) {
    return '{}';
  }
  const contents = fs.readFileSync(path, 'utf8');
  return contents || '{}';
};

const createDataDir = function(path) {
  return !fs.existsSync(path) && fs.mkdirSync(path);
};

const loadTodos = readFile.bind(null, DATA_STORE);
const loadCredentials = readFile.bind(null, CREDENTIALS_STORE);

const writeFile = (path, content) => fs.writeFileSync(path, content);
const writeTodoLists = writeFile.bind(null, DATA_STORE);
const writeUserCredentials = writeFile.bind(null, CREDENTIALS_STORE);

module.exports = {
  loadCredentials,
  loadTodos,
  writeTodoLists,
  writeUserCredentials,
  createDataDir
};

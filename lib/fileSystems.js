const fs = require('fs');

const { DATA_STORE } = require('../config');

const loadTodos = function() {
  if (!fs.existsSync(DATA_STORE)) {
    return '[]';
  }
  const contents = fs.readFileSync(DATA_STORE, 'utf8');
  return contents || '[]';
};

module.exports = { loadTodos };

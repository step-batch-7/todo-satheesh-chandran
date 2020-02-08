const getDataStorePath = function(env) {
  return env.DATA_STORE || './data/todo.json';
};

module.exports = { getDataStorePath };

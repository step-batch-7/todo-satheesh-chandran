const { TodoRecords } = require('./todo');
const { writeTodoLists, writeUserCredentials } = require('./fileSystems');

const parseUsers = function(content) {
  const users = JSON.parse(content);
  for (const user in users) {
    users[user] = TodoRecords.loadTodo(users[user]);
  }
  return users;
};

const getLocals = function(req) {
  return req.app.locals;
};

const loginUser = function(req, res) {
  const { username, password } = req.body;
  const { sessions, userCredentials } = getLocals(req);
  const validPassword = userCredentials[username];
  if (validPassword && validPassword === password) {
    res.cookie('session', 1);
    sessions[username] = 1;
    return res.redirect('/home.html');
  }
  res.status(404).send('Username or password is wrong');
};

const redirectToIndex = function(req, res, next) {
  return req.user ? next() : res.redirect('/');
};

const redirectToHome = function(req, res, next) {
  return req.user ? res.redirect('/home.html') : next();
};

const findUser = function(req, res, next) {
  const { session } = req.cookies;
  const { sessions } = getLocals(req);
  if (session) {
    const users = Object.keys(sessions);
    req.user = users.find(user => sessions[user] === +session);
  }
  next();
};

const serveTodos = function(req, res) {
  const { users } = getLocals(req);
  res.json(users[req.user]);
};

const addNewTodo = function(req, res) {
  const { users } = getLocals(req);
  const TODOS = users[req.user];
  TODOS.addTodo({ name: req.body.name, tasks: [] });
  writeTodoLists(JSON.stringify(users));
  serveTodos(req, res);
};

const deleteTodo = function(req, res) {
  const { users } = getLocals(req);
  const TODOS = users[req.user];
  TODOS.deleteTodo(req.body.id);
  writeTodoLists(JSON.stringify(users));
  serveTodos(req, res);
};

const serveRefererTodo = function(req, res) {
  const [, id] = req.headers.referer.split('=');
  serveTodo(req, res, id);
};

const serveTodo = function(req, res, todoId) {
  const { users } = getLocals(req);
  const TODOS = users[req.user];
  const todo = TODOS.findTodo(todoId);
  writeTodoLists(JSON.stringify(users));
  res.json(todo);
};

const addNewTask = function(req, res) {
  const TODOS = getLocals(req).users[req.user];
  const { taskName, todoId } = req.body;
  TODOS.addTodoTask(todoId, taskName);
  serveTodo(req, res, todoId);
};

const deleteTask = function(req, res) {
  const TODOS = getLocals(req).users[req.user];
  const { todoId, taskId } = req.body;
  TODOS.deleteTodoTask(todoId, taskId);
  serveTodo(req, res, todoId);
};

const toggleTaskStatus = function(req, res) {
  const TODOS = getLocals(req).users[req.user];
  const { todoId, taskId } = req.body;
  TODOS.changeTaskStatus(todoId, taskId);
  serveTodo(req, res, todoId);
};

const editTask = function(req, res) {
  const TODOS = getLocals(req).users[req.user];
  const { todoId, taskId, value } = req.body;
  TODOS.editTaskName(todoId, taskId, value);
  serveTodo(req, res, todoId);
};

const editTodo = function(req, res) {
  const TODOS = getLocals(req).users[req.user];
  const { todoId, value } = req.body;
  TODOS.editTodoName(todoId, value);
  serveTodo(req, res, todoId);
};

const doesUserNamePresent = function(req, res) {
  const { username } = req.body;
  if (username === 'satheesh') {
    return res.json({ isPresent: true });
  }
  res.setHeader('Set-Cookie', 'name=hi');
  res.json({ isPresent: false });
};

const hasFields = function(...fields) {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).end();
  };
};

const signUp = function(req, res) {
  const { username, password } = req.body;
  const { userCredentials, users } = getLocals(req);
  userCredentials[username] = password;
  users[username] = TodoRecords.loadTodo([]);
  writeTodoLists(JSON.stringify(users));
  writeUserCredentials(JSON.stringify(userCredentials));
  res.redirect('/');
};

module.exports = {
  hasFields,
  serveTodos,
  serveRefererTodo,
  toggleTaskStatus,
  deleteTask,
  addNewTask,
  addNewTodo,
  deleteTodo,
  editTask,
  editTodo,
  doesUserNamePresent,
  loginUser,
  redirectToHome,
  redirectToIndex,
  findUser,
  parseUsers,
  signUp
};

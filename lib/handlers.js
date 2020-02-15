const fs = require('fs');
const { TodoRecords } = require('./todo');
// const CONTENT_TYPES = require('./mimeTypes');
const { loadTodos } = require('./fileSystems');
const sessions = require('../data/sessions');
const LIST_STORE = './data/todo.json';

const parseUsers = function(content) {
  const users = JSON.parse(content);
  for (const user in users) {
    users[user] = TodoRecords.loadTodo(users[user]);
  }
  return users;
};

const users = parseUsers(loadTodos());

const loginUser = function(req, res) {
  const { username, password } = req.body;
  const user = sessions[username];
  if (user && user.password === password) {
    res.cookie('session', 1);
    user.session = 1;
    res.redirect('/home.html');
  }
  res.status(404).send('Username or password is wrong');
};

const redirectToIndex = function(req, res, next) {
  return req.user ? next() : res.redirect('/');
};

const redirectToHome = function(req, res, next) {
  req.user && res.redirect('/home.html');
  next();
};

const findUser = function(req, res, next) {
  const { session } = req.cookies;
  if (session) {
    const users = Object.keys(sessions);
    req.user = users.find(user => sessions[user].session === +session);
  }
  next();
};

const serveTodos = function(req, res) {
  res.json(users[req.user]);
};

const addNewTodo = function(req, res) {
  const TODOS = users[req.user];
  TODOS.addTodo({ name: req.body.name, tasks: [] });
  fs.writeFileSync(LIST_STORE, JSON.stringify(users), 'utf8');
  serveTodos(req, res);
};

const deleteTodo = function(req, res) {
  const TODOS = users[req.user];
  TODOS.deleteTodo(req.body.id);
  fs.writeFileSync(LIST_STORE, JSON.stringify(users), 'utf8');
  serveTodos(req, res);
};

const serveRefererTodo = function(req, res) {
  const [, id] = req.headers.referer.split('=');
  serveTodo(req, res, id);
};

const serveTodo = function(req, res, todoId) {
  const TODOS = users[req.user];
  const todo = TODOS.findTodo(todoId);
  fs.writeFileSync(LIST_STORE, JSON.stringify(users), 'utf8');
  res.json(todo);
};

const addNewTask = function(req, res) {
  const TODOS = users[req.user];
  const { taskName, todoId } = req.body;
  TODOS.addTodoTask(todoId, taskName);
  serveTodo(req, res, todoId);
};

const deleteTask = function(req, res) {
  const TODOS = users[req.user];
  const { todoId, taskId } = req.body;
  TODOS.deleteTodoTask(todoId, taskId);
  serveTodo(req, res, todoId);
};

const toggleTaskStatus = function(req, res) {
  const TODOS = users[req.user];
  const { todoId, taskId } = req.body;
  TODOS.changeTaskStatus(todoId, taskId);
  serveTodo(req, res, todoId);
};

const editTask = function(req, res) {
  const TODOS = users[req.user];
  const { todoId, taskId, value } = req.body;
  TODOS.editTaskName(todoId, taskId, value);
  serveTodo(req, res, todoId);
};

const editTodo = function(req, res) {
  const TODOS = users[req.user];
  const { todoId, value } = req.body;
  TODOS.editTodoName(todoId, value);
  serveTodo(req, res, todoId);
};

const doesUserNamePresent = function(req, res) {
  const { username } = req.body;
  if (username === 'satheesh') {
    res.json({ isPresent: true });
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
  findUser
};

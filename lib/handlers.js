const { TodoRecords } = require('./todo');
const { writeTodoLists, writeUserCredentials } = require('./fileSystems');

const parseUsers = function(content) {
  const users = JSON.parse(content);
  for (const user in users) {
    users[user] = TodoRecords.loadTodo(users[user]);
  }
  return users;
};

const loginUser = function(req, res) {
  const { username, password } = req.body;
  const { sessionManager, userCredentials } = req.app.locals;
  const validPassword = userCredentials[username];
  let isValid = false;
  if (validPassword && validPassword === password) {
    res.cookie('SID', sessionManager.createSession(username));
    isValid = true;
  }
  res.json({ isValid });
};

const redirectToHome = function(req, res, next) {
  return req.user ? res.redirect('/user/home.html') : next();
};

const findUserTodos = function(req, res, next) {
  req.TODOS = req.app.locals.users[req.user];
  next();
};

const findUser = function(req, res, next) {
  const { SID } = req.cookies;
  if (SID) {
    const { sessionManager } = req.app.locals;
    req.user = sessionManager.getUser(SID);
  }
  next();
};

const serveTodos = function(req, res) {
  if (!req.user) {
    return res.status(400).send();
  }
  res.json(req.TODOS);
};

const addNewTodo = function(req, res) {
  const { users } = req.app.locals;
  req.TODOS.addTodo({ name: req.body.name, tasks: [] });
  writeTodoLists(JSON.stringify(users));
  serveTodos(req, res);
};

const deleteTodo = function(req, res) {
  const { users } = req.app.locals;
  req.TODOS.deleteTodo(req.body.id);
  writeTodoLists(JSON.stringify(users));
  serveTodos(req, res);
};

const serveRefererTodo = function(req, res) {
  if (!req.user) {
    return res.status(400).send();
  }
  const [, id] = req.headers.referer.split('=');
  serveTodo(req, res, id);
};

const serveTodo = function(req, res, todoId) {
  const { users } = req.app.locals;
  const todo = req.TODOS.findTodo(todoId);
  writeTodoLists(JSON.stringify(users));
  res.json(todo);
};

const addNewTask = function(req, res) {
  const { taskName, todoId } = req.body;
  req.TODOS.addTodoTask(todoId, taskName);
  serveTodo(req, res, todoId);
};

const deleteTask = function(req, res) {
  const { todoId, taskId } = req.body;
  req.TODOS.deleteTodoTask(todoId, taskId);
  serveTodo(req, res, todoId);
};

const toggleTaskStatus = function(req, res) {
  const { todoId, taskId } = req.body;
  req.TODOS.changeTaskStatus(todoId, taskId);
  serveTodo(req, res, todoId);
};

const editTask = function(req, res) {
  const { todoId, taskId, value } = req.body;
  req.TODOS.editTaskName(todoId, taskId, value);
  serveTodo(req, res, todoId);
};

const editTodo = function(req, res) {
  const { todoId, value } = req.body;
  req.TODOS.editTodoName(todoId, value);
  serveTodo(req, res, todoId);
};

const hasFields = function(...fields) {
  return (req, res, next) => {
    if (fields.every(field => field in req.body)) {
      return next();
    }
    res.status(400).send();
  };
};

const signUp = function(req, res) {
  const { username, password } = req.body;
  const { userCredentials, users } = req.app.locals;
  if (username in userCredentials) {
    return res.json({ isValid: false });
  }
  userCredentials[username] = password;
  users[username] = TodoRecords.loadTodo([]);
  writeTodoLists(JSON.stringify(users));
  writeUserCredentials(JSON.stringify(userCredentials));
  res.json({ isValid: true });
};

const logout = function(req, res) {
  if (!req.user) {
    return res.status(400).send();
  }
  const { sessionManager } = req.app.locals;
  sessionManager.delete(req.cookies.SID);
  res.clearCookie('SID').redirect('/');
};

const shouldBeLoggedIn = function(req, res, next) {
  if (req.user) {
    return next();
  }
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
  loginUser,
  redirectToHome,
  findUser,
  parseUsers,
  signUp,
  findUserTodos,
  logout,
  shouldBeLoggedIn
};

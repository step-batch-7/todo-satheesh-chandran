const fs = require('fs');
const { App } = require('../lib/app');
const { TodoRecords } = require('./todo');
const CONTENT_TYPES = require('./mimeTypes');
const LIST_STORE = './data/todo.json';
const { loadTodos, setPath } = require('./fileSystems');

const TODOS = TodoRecords.loadTodo(JSON.parse(loadTodos()));

const serveEditPage = function(req, res, next) {
  req.url = '/editPage.html';
  serveStaticPage(req, res, next);
};

const serveStaticPage = function(req, res, next) {
  const path = setPath(req.url);
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return next();
  }
  const content = fs.readFileSync(path);
  const type = path.split('.').pop();
  res.setHeader('Content-Type', CONTENT_TYPES[type]);
  res.end(content);
};

const serveTodos = function(req, res) {
  const content = TODOS.toJSON();
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(content);
};

const readBody = function(req, res, next) {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    req.body = data;
    next();
  });
};

const notFound = function(req, res) {
  res.statusCode = 404;
  res.end('File Not Found');
};

const methodNotAllowed = function(req, res) {
  res.statusCode = 405;
  res.end('Method Not Allowed');
};

const addNewTodo = function(req, res) {
  const { name } = JSON.parse(req.body);
  TODOS.addTodo({ name, tasks: [] });
  fs.writeFileSync(LIST_STORE, TODOS.toJSON(), 'utf8');
  serveTodos(req, res);
};

const deleteTodo = function(req, res) {
  const { id } = JSON.parse(req.body);
  TODOS.deleteTodo(id);
  fs.writeFileSync(LIST_STORE, TODOS.toJSON(), 'utf8');
  serveTodos(req, res);
};

const serveRefererTodo = function(req, res) {
  const [, id] = req.headers.referer.split('=');
  serveTodo(req, res, id);
};

const serveTodo = function(req, res, todoId) {
  const todo = TODOS.findTodo(todoId);
  fs.writeFileSync(LIST_STORE, TODOS.toJSON(), 'utf8');
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todo));
};

const addNewTask = function(req, res) {
  const { taskName, todoId } = JSON.parse(req.body);
  TODOS.addTodoTask(todoId, taskName);
  serveTodo(req, res, todoId);
};

const deleteTask = function(req, res) {
  const { todoId, taskId } = JSON.parse(req.body);
  TODOS.deleteTodoTask(todoId, taskId);
  serveTodo(req, res, todoId);
};

const toggleTaskStatus = function(req, res) {
  const { todoId, taskId } = JSON.parse(req.body);
  TODOS.changeTaskStatus(todoId, taskId);
  serveTodo(req, res, todoId);
};

const editTask = function(req, res) {
  const { todoId, taskId, value } = JSON.parse(req.body);
  TODOS.editTaskName(todoId, taskId, value);
  serveTodo(req, res, todoId);
};

const editTodo = function(req, res) {
  const { todoId, value } = JSON.parse(req.body);
  TODOS.editTodoName(todoId, value);
  serveTodo(req, res, todoId);
};

const app = new App();

app.use(readBody);

app.get(/.*?todoId=/, serveEditPage);
app.get('/todos', serveTodos);
app.get('', serveStaticPage);
app.get('/todo', serveRefererTodo);
app.get('', notFound);

app.post('/toggleStatus', toggleTaskStatus);
app.post('/deleteTask', deleteTask);
app.post('/newTask', addNewTask);
app.post('/addNewTodo', addNewTodo);
app.post('/delete', deleteTodo);
app.post('/editTask', editTask);
app.post('/editTodo', editTodo);
app.post('', notFound);

app.use(methodNotAllowed);

module.exports = { app };

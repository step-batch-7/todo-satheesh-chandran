const fs = require('fs');
const { App } = require('../lib/app');
const { TodoRecords } = require('./todo');
const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');
const LIST_STORE = './data/todo.json';
const { loadTodos, setPath } = require('./fileSystems');

const TODOS = TodoRecords.loadTodo(JSON.parse(loadTodos()));

const serveEditPage = function(req, res) {
  const path = `${__dirname}/../public/editPage.html`;
  const content = fs.readFileSync(path);
  const type = path.split('.').pop();
  res.setHeader('Content-Type', CONTENT_TYPES[type]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const serveStaticPage = function(req, res, next) {
  const path = setPath(req);
  const stat = fs.existsSync(path) && fs.statSync(path);
  if (!stat || !stat.isFile()) {
    return next();
  }
  const content = fs.readFileSync(path);
  const type = path.split('.').pop();
  res.setHeader('Content-Type', CONTENT_TYPES[type]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const serveJsonContent = function(req, res) {
  const content = TODOS.toJSON();
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.setHeader('Content-Length', content.length);
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
  const type = 'html';
  const content = fs.readFileSync(`${__dirname}/../public/notFound.html`);
  res.setHeader('Content-Type', CONTENT_TYPES[type]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const methodNotAllowed = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(STATUS_CODE.METHOD_NOT_ALLOWED);
  res.end('Method Not Allowed');
};

const addNewTodo = function(req, res) {
  const newList = JSON.parse(req.body);
  TODOS.addTodo(newList);
  fs.writeFileSync(LIST_STORE, TODOS.toJSON(), 'utf8');
  res.end();
};

const deleteTodo = function(req, res) {
  TODOS.deleteTodo(req.body);
  fs.writeFileSync(LIST_STORE, TODOS.toJSON(), 'utf8');
  res.end();
};

const serveIdElement = function(req, res) {
  const [, id] = req.headers.referer.split('=');
  const todoLists = TODOS.findTodo(id);
  const content = JSON.stringify(todoLists);

  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.setHeader('Content-Length', content.length);
  res.end(content);
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
app.get('/todos', serveJsonContent);
app.get('', serveStaticPage);
app.get('/tasks', serveIdElement);
app.get('', notFound);

app.post('/toggleStatus', toggleTaskStatus);
app.post('/deleteTask', deleteTask);
app.post('/newTask', addNewTask);
app.post('/addNewTodo', addNewTodo);
app.post('/delete', deleteTodo);
app.post('/editTask', editTask);
app.post('/editTodo', editTodo);
app.post('', methodNotAllowed);

app.use(methodNotAllowed);

module.exports = { app };

const fs = require('fs');
const { App } = require('../lib/app');
const { TodoRecords, Todo } = require('./todo');
const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = require('./statusCodes');
const LIST_STORE = './data/todo.json';
const { loadTodos, setPath } = require('./fileSystems');

let REQUESTED_ID = 0;
const TODOS = TodoRecords.loadTodo(JSON.parse(loadTodos()));
// console.log(TODOS);

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
  const content = JSON.stringify(TODOS);
  res.setHeader('Content-Type', 'text/plain');
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
  const content = fs.readFileSync(
    '/Users/step13/html/todo-satheesh-chandran/public/notFound.html'
  );
  res.setHeader('Content-Type', CONTENT_TYPES[type]);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const methodNotAllowed = function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.writeHead(STATUS_CODE.METHOD_NOT_ALLOWED);
  res.end('Method Not Allowed');
};

const getTodoListId = function() {
  if (TODOS.todoLists.length > 0) {
    const allList = TODOS.todoLists;
    return allList[allList.length - 1].id + 1;
  }
  return 1;
};

const addNewList = function(req, res) {
  let newList = JSON.parse(req.body);
  newList = new Todo(newList.name, newList.tasks, getTodoListId());
  newList.setTaskId();
  TODOS.addTodo(newList);
  fs.writeFileSync(LIST_STORE, JSON.stringify(TODOS.todoLists), 'utf8');
  // res.writeHead(STATUS_CODE.OK);
  res.end();
};

const deleteList = function(req, res) {
  TODOS.filter(list => `${list.id}` !== req.body);
  fs.writeFileSync(LIST_STORE, JSON.stringify(TODOS), 'utf8');
  res.writeHead(STATUS_CODE.OK);
  res.end();
};

const saveRequestedId = function(req, res) {
  REQUESTED_ID = req.body;
  res.writeHead(STATUS_CODE.OK);
  res.end();
};

const serveId = function(req, res) {
  const content = REQUESTED_ID;
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const app = new App();

app.use(readBody);

app.get('/todos', serveJsonContent);
app.get('', serveStaticPage);
app.get('/tasks', serveId);
app.get('', notFound);

app.post('/list', addNewList);
app.post('/delete', deleteList);
app.post('/tasks', saveRequestedId);
app.post('', methodNotAllowed);

app.use(methodNotAllowed);

module.exports = { app };

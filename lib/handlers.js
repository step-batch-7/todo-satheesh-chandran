const fs = require('fs');
const querystring = require('querystring');
const { App } = require('../lib/app');
const { TodoRecords, Todo } = require('./todo');
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
  const content = JSON.stringify(TODOS);
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
  res.end();
};

const deleteList = function(req, res) {
  TODOS.todoLists = TODOS.todoLists.filter(list => `${list.id}` !== req.body);
  fs.writeFileSync(LIST_STORE, JSON.stringify(TODOS.todoLists), 'utf8');
  res.end();
};

const serveIdElement = function(req, res) {
  const [, id] = req.headers.referer.split('=');
  const todoLists = TODOS.todoLists.find(todo => `${todo.id}` === id);
  const content = JSON.stringify(todoLists);

  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.setHeader('Content-Length', content.length);
  res.end(content);
};

const changeTasks = function(req, res) {
  const editedList = JSON.parse(req.body);
  TODOS.replaceTasks(editedList);
  fs.writeFileSync(LIST_STORE, JSON.stringify(TODOS.todoLists), 'utf8');
  res.setHeader('method', 'GET');
  res.setHeader('Content-Type', 'text/plain');
  res.end(JSON.stringify(editedList));
};

const parseNewTask = function(body) {
  const newTask = JSON.parse(body);
  const [todoId, taskId] = newTask.lastTaskId.split('_');
  const newTaskId = `${todoId}_${+taskId + 1}`;
  return { status: false, name: newTask.taskName, id: newTaskId };
};

const resendNewTask = function(req, res) {
  const addedTask = parseNewTask(req.body);
  res.setHeader('method', 'GET');
  res.setHeader('Content-Type', 'text/plain');
  res.end(JSON.stringify(addedTask));
};

const storeAndLogin = function(req, res) {
  const userDetails = querystring.parse(req.body);
  if (userDetails.password !== userDetails.confirm) {
    res.writeHead(STATUS_CODE.REDIRECT, {
      Location: '/index.html'
    });
    res.end();
  }
  res.end();
};

const app = new App();

app.use(readBody);

app.get(/.*?todoId=/, serveEditPage);
app.get('/todos', serveJsonContent);
app.get('', serveStaticPage);
app.get('/tasks', serveIdElement);
app.get('', notFound);

app.post('/signup', storeAndLogin);
app.post('/newTask', resendNewTask);
app.post('/list', addNewList);
app.post('/delete', deleteList);
app.post('/editedList', changeTasks);
app.post('', methodNotAllowed);

app.use(methodNotAllowed);

module.exports = { app };

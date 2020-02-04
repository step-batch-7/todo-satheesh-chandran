const fs = require('fs');
const { App } = require('../lib/app');

const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = {
  NOT_FOUND: 404,
  REDIRECT: 301,
  METHOD_NOT_ALLOWED: 400,
  OK: 200
};
const LIST_STORE = './data/todo.json';
let REQUESTED_ID = 0;

/////////////////////////////////////////////////
const loadTodos = function() {
  if (!fs.existsSync(LIST_STORE)) {
    return '[]';
  }
  const contents = fs.readFileSync(LIST_STORE, 'utf8');
  if (contents === '') {
    return '[]';
  }
  return contents;
};
let TODOS = JSON.parse(loadTodos());
/////////////////////////////////////////////////

const setPath = function(req) {
  let path = `${__dirname}/../public${req.url}`;
  if (req.url === '/') {
    path = `${__dirname}/../public/home.html`;
  }
  return path;
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

const addList = function(req, res) {
  TODOS.push(JSON.parse(req.body));
  fs.writeFileSync(LIST_STORE, JSON.stringify(TODOS), 'utf8');
  res.writeHead(STATUS_CODE.OK);
  res.end();
};

const deleteList = function(req, res) {
  TODOS = TODOS.filter(list => `${list.id}` !== req.body);
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

app.post('/list', addList);
app.post('/delete', deleteList);
app.post('/tasks', saveRequestedId);
app.post('', notFound);

app.use(methodNotAllowed);

module.exports = { app };

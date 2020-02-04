const fs = require('fs');
const { App } = require('../lib/app');

const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = { NOT_FOUND: 404, REDIRECT: 301, METHOD_NOT_ALLOWED: 400 };
const LIST_STORE = './data/todo.json';
let REQUESTED_ID = 0;

/////////////////////////////////////////////////
const loadLists = function() {
  if (!fs.existsSync(LIST_STORE)) {
    return '[]';
  }
  const contents = fs.readFileSync(LIST_STORE, 'utf8');
  if (contents === '') {
    return '[]';
  }
  return contents;
};
let LIST = JSON.parse(loadLists());
/////////////////////////////////////////////////

const setPath = function(req) {
  let path = `${__dirname}/../public${req.url}`;
  if (req.url === '/') {
    path = `${__dirname}/../public/home.html`;
  }
  return path;
};

const serveHomePage = function(req, res, next) {
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
  const content = JSON.stringify(LIST);
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
  LIST.push(JSON.parse(req.body));
  fs.writeFileSync(LIST_STORE, JSON.stringify(LIST), 'utf8');
  res.writeHead(STATUS_CODE.REDIRECT, {
    Location: '/home.html'
  });
  res.end();
};

const deleteList = function(req, res) {
  const refreshedList = LIST.filter(list => `${list.id}` !== req.body);
  LIST = refreshedList;
  fs.writeFileSync(LIST_STORE, JSON.stringify(LIST), 'utf8');
  res.writeHead(STATUS_CODE.REDIRECT, {
    Location: '/home.html'
  });
  res.end();
};

const saveRequestedId = function(req, res) {
  REQUESTED_ID = req.body;
  res.writeHead(STATUS_CODE.REDIRECT, {
    Location: './editPage.html'
  });
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

app.get('/list', serveJsonContent);
app.get('/', serveHomePage);
app.get('/home.html', serveHomePage);
app.get('/writePage.html', serveHomePage);
app.post('/list', addList);
app.post('/delete', deleteList);
app.post('/tasks', saveRequestedId);
app.get('/tasks', serveId);
app.get('', notFound);
app.post('', notFound);
app.use(methodNotAllowed);
// console.log(app);

module.exports = { app };

// const appendChildHTML = (selector, html) => {
//   const temp = document.createElement('div');
//   temp.innerHTML = html;
//   document.querySelector(selector).appendChild(temp.firstChild);
// };

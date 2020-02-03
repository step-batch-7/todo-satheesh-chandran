const fs = require('fs');
const { App } = require('../lib/app');

const CONTENT_TYPES = require('./mimeTypes');
const STATUS_CODE = { NOT_FOUND: 404, REDIRECT: 301, METHOD_NOT_ALLOWED: 400 };

const list = JSON.parse(fs.readFileSync('./data/todo.json', 'utf8'));

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

// const serveWritePage=function(req,res,)

const app = new App();

app.get('/', serveHomePage);
app.get('/home.html', serveHomePage);
app.get('/writePage.html', serveHomePage);

module.exports = { app };

// const appendChildHTML = (selector, html) => {
//   const temp = document.createElement('div');
//   temp.innerHTML = html;
//   document.querySelector(selector).appendChild(temp.firstChild);
// };

const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/handlers');

const STATUS_CODES = { OK: 200, METHOD_NOT_FOUND: 400, REDIRECT: 301 };

describe('GET request for static files', function() {
  it('should give the home.html for url /', done => {
    request(app.serve.bind(app))
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(/\/css\/home.css/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the home.css url /css/home.css', done => {
    request(app.serve.bind(app))
      .get('/css/home.css')
      .expect('Content-Type', 'text/css')
      .expect(/body {/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the home.js url /js/home.js', done => {
    request(app.serve.bind(app))
      .get('/js/home.js')
      .expect('Content-Type', 'application/javascript')
      .expect(/updateTodosOnPage/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the home page with url /home.html', done => {
    request(app.serve.bind(app))
      .get('/home.html')
      .expect('Content-Type', 'text/html')
      .expect(/\/css\/home.css/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the all todos', done => {
    request(app.serve.bind(app))
      .get('/todos')
      .expect('Content-Type', 'application/json')
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the editPage.html for /editPage.html?todoId=1', done => {
    request(app.serve.bind(app))
      .get('/editPage.html?todoId=1')
      .expect('Content-Type', 'text/html')
      .expect(/<title>edit page<\/title>/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the editPage.css for /css/editPage.css', done => {
    request(app.serve.bind(app))
      .get('/css/editPage.css')
      .expect('Content-Type', 'text/css')
      .expect(/.popUp-window {/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the editPage.js for /js/editPage.js', done => {
    request(app.serve.bind(app))
      .get('/js/editPage.js')
      .expect('Content-Type', 'application/javascript')
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the writePage.css for /css/writePage.css', done => {
    request(app.serve.bind(app))
      .get('/css/writePage.css')
      .expect('Content-Type', 'text/css')
      .expect(/.submit-button:hover/)
      .expect(STATUS_CODES.OK, done);
  });
});

describe('GET request for non existing files', function() {
  it('should return a 404 message ', done => {
    request(app.serve.bind(app))
      .get('/ajhsdfnbjhbk')
      .expect('Content-Type', 'text/html')
      .expect(/404 File Not Found/)
      .expect(STATUS_CODES.OK, done);
  });
});

describe('Not Allowed Method', () => {
  it('should give 400 status code when the method is not allowed', done => {
    request(app.serve.bind(app))
      .put('/home.html')
      .expect('Content-Type', 'text/plain')
      .expect('Method Not Allowed')
      .expect(405, done);
  });
});

describe('POST request for saving the newly added todo lists', function() {
  before(() => sinon.replace(fs, 'writeFileSync', () => {}));
  it('should save the given new todo list for url /list', done => {
    const todoList = {
      tasks: [{ id: '1580814492961', status: false, name: 'hai' }],
      name: 'satheesh',
      id: 1580814494776
    };
    request(app.serve.bind(app))
      .post('/list')
      .send(JSON.stringify(todoList))
      .expect(STATUS_CODES.OK, done);
  });
  after(() => sinon.restore());
});

describe('POST for newTask', function() {
  before(() => sinon.replace(fs, 'writeFileSync', () => {}));
  it('should save the new task given with url /newTask', done => {
    const addedList = { lastTaskId: '1_0', taskName: 'hai' };
    request(app.serve.bind(app))
      .post('/newTask')
      .send(JSON.stringify(addedList))
      .expect(STATUS_CODES.OK, done);
  });
  after(() => sinon.restore());
});

describe('POST of editted tasks', function() {
  before(() => sinon.replace(fs, 'writeFileSync', () => {}));
  it('should save the editted list for url /editedList', done => {
    const addedList = `{
      "tasks":[{"status":true,"name":"new one","id":"10_1"}],
      "id":"10","name":"satheesh chandran"
      }`;

    request(app.serve.bind(app))
      .post('/editedList')
      .send(addedList)
      .expect(STATUS_CODES.OK, done);
  });
  after(() => sinon.restore());
});

describe('POST of deleting todo list', function() {
  before(() => sinon.replace(fs, 'writeFileSync', () => {}));
  it('should delete the requested list from memory for url /delete', done => {
    request(app.serve.bind(app))
      .post('/delete')
      .send('1')
      .expect(STATUS_CODES.OK, done);
  });
  after(() => sinon.restore());
});

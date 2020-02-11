const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/handlers');

const STATUS_CODES = { OK: 200, METHOD_NOT_FOUND: 400, REDIRECT: 301 };

describe('GET', function() {
  describe('home page', function() {
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
  });

  describe('edit page', function() {
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

    it('should give a todo for /tasks', done => {
      const task = { id: 0, name: 'one', status: true };
      const todo = { name: 'sruthy', tasks: [task], id: 1 };
      const expected = JSON.stringify(todo);
      request(app.serve.bind(app))
        .get('/tasks')
        .set('referer', 'http://localhost:8000/editPage.html?todoId=1')
        .expect('Content-Type', 'application/json')
        .expect(expected)
        .expect(STATUS_CODES.OK, done);
    });
  });

  describe('write page', function() {
    it('should give the writePage.html for /writePage.html', done => {
      request(app.serve.bind(app))
        .get('/writePage.html')
        .expect('Content-Type', 'text/html')
        .expect(/<title>writePage<\/title>/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the writePage.css for /css/writePage.css', done => {
      request(app.serve.bind(app))
        .get('/css/writePage.css')
        .expect('Content-Type', 'text/css')
        .expect(/.submit-button:hover/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the writePage.js for /js/writePage.js', done => {
      request(app.serve.bind(app))
        .get('/js/writePage.js')
        .expect('Content-Type', 'application/javascript')
        .expect(STATUS_CODES.OK, done);
    });
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

describe('POST', function() {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());
  it('should save the given new todo list for url /list', done => {
    const todoList = {
      tasks: [{ status: false, name: 'hai' }],
      name: 'satheesh'
    };
    request(app.serve.bind(app))
      .post('/addNewTodo')
      .send(JSON.stringify(todoList))
      .expect(STATUS_CODES.OK, done);
  });

  it('should save the new task given with url /newTask', done => {
    const addedList = { todoId: '1', taskName: 'hai' };
    request(app.serve.bind(app))
      .post('/newTask')
      .send(JSON.stringify(addedList))
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete tasks for url /toggleStatus', done => {
    const body = { todoId: '1', taskId: '1' };
    request(app.serve.bind(app))
      .post('/toggleStatus')
      .send(JSON.stringify(body))
      .expect(STATUS_CODES.OK, done);
  });

  it('should edit the name of the task for url /editTask', done => {
    const body = { taskId: 1, todoId: 1, value: 'some' };
    request(app.serve.bind(app))
      .post('/editTask')
      .send(JSON.stringify(body))
      .expect(STATUS_CODES.OK, done);
  });

  it('should edit the name of the todo for url /editTodo', done => {
    const body = { todoId: 1, value: 'some' };
    request(app.serve.bind(app))
      .post('/editTodo')
      .send(JSON.stringify(body))
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete tasks for url /deleteTask', done => {
    const deletedTask = { todoId: '1', taskId: '2' };
    request(app.serve.bind(app))
      .post('/deleteTask')
      .send(JSON.stringify(deletedTask))
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete the requested list from memory for url /delete', done => {
    request(app.serve.bind(app))
      .post('/delete')
      .send('1')
      .expect(STATUS_CODES.OK, done);
  });
});

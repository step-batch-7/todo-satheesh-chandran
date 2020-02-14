const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/routes');

const STATUS_CODES = { OK: 200, METHOD_NOT_FOUND: 400, REDIRECT: 301 };

describe('GET', function() {
  describe('home page', function() {
    it('should give the home.html for url /', done => {
      request(app)
        .get('/')
        .set('Accept', '*')
        .expect('Content-Type', /html/)
        .expect(/\/css\/index.css/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the home.css url /css/home.css', done => {
      request(app)
        .get('/css/home.css')
        .expect('Content-Type', /css/)
        .expect(/body {/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the home.js url /js/home.js', done => {
      request(app)
        .get('/js/home.js')
        .expect('Content-Type', /javascript/)
        .expect(/updateTodosOnPage/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the all todos', done => {
      request(app)
        .get('/todos')
        .expect('Content-Type', /json/)
        .expect(STATUS_CODES.OK, done);
    });
  });

  describe('edit page', function() {
    beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
    afterEach(() => sinon.restore());
    it('should give the editPage.html for /editPage.html?todoId=1', done => {
      request(app)
        .get('/editPage.html?todoId=1')
        .expect('Content-Type', /html/)
        .expect(/<title>edit page<\/title>/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the editPage.css for /css/editPage.css', done => {
      request(app)
        .get('/css/editPage.css')
        .expect('Content-Type', /css/)
        .expect(/.popUp-window {/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the editPage.js for /js/editPage.js', done => {
      request(app)
        .get('/js/editPage.js')
        .expect('Content-Type', /javascript/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give a todo for /todo', done => {
      const task = { id: 1, name: 'one', status: true };
      const todo = { name: 'sruthy', tasks: [task], id: 1 };
      const expected = JSON.stringify(todo);
      request(app)
        .get('/todo')
        .set('referer', 'http://localhost:8000/editPage.html?todoId=1')
        .expect('Content-Type', /json/)
        .expect(expected)
        .expect(STATUS_CODES.OK, done);
    });
  });
});

describe('GET request for non existing files', function() {
  it('should return a 404 message ', done => {
    request(app)
      .get('/badPage')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('Not Allowed Method', () => {
  it('should give 400 status code when the method is not allowed', done => {
    request(app)
      .put('/home.html')
      .expect('Content-Type', /html/)
      .expect(404, done);
  });
});

describe('POST', function() {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());
  it('should save the given new todo list for url /addNewTodo', done => {
    request(app)
      .post('/addNewTodo')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ name: 'new Todo' }))
      // .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should save the new task given with url /newTask', done => {
    const addedList = { todoId: '1', taskName: 'hai' };
    request(app)
      .post('/newTask')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(addedList))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete tasks for url /toggleStatus', done => {
    const body = { todoId: '1', taskId: '1' };
    request(app)
      .post('/toggleStatus')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect(STATUS_CODES.OK, done);
  });

  it('should edit the name of the task for url /editTask', done => {
    const body = { taskId: 1, todoId: 1, value: 'some' };
    request(app)
      .post('/editTask')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should edit the name of the todo for url /editTodo', done => {
    const body = { todoId: 1, value: 'some' };
    request(app)
      .post('/editTodo')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete tasks for url /deleteTask', done => {
    const deletedTask = { todoId: '1', taskId: '2' };
    request(app)
      .post('/deleteTask')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(deletedTask))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete the requested list from memory for url /delete', done => {
    request(app)
      .post('/delete')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ id: 1 }))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });
});

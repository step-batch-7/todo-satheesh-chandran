const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/routes');

const STATUS_CODES = {
  OK: 200,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  REDIRECT: 301,
  FOUND: 302
};

describe('GET', function() {
  describe('home page', function() {
    it('should give the index.html for url / if user not logged in', done => {
      request(app)
        .get('/')
        .set('Accept', '*')
        .expect('Content-Type', /html/)
        .expect(/login/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should redirect to / unknown user have to access home.html', done => {
      request(app)
        .get('/home.html')
        .expect(STATUS_CODES.FOUND, done);
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

    it('should redirect to home.html for / if user logged in', done => {
      request(app)
        .get('/')
        .set('Cookie', 'SID=1')
        .expect(STATUS_CODES.FOUND, done);
    });

    it('should give the all todos if user logged in', done => {
      request(app)
        .get('/todos')
        .set('Cookie', 'SID=1')
        .expect('Content-Type', /json/)
        .expect(/Experimenting/)
        .expect(STATUS_CODES.OK, done);
    });
  });

  describe('edit page', function() {
    beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
    afterEach(() => sinon.restore());
    it('should give the editPage.html for /editPage.html?todoId=1', done => {
      request(app)
        .get('/editPage.html?todoId=1')
        .set('Cookie', 'SID=1')
        .expect('Content-Type', /html/)
        .expect(/<title>edit page<\/title>/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the editPage.css for /css/editPage.css', done => {
      request(app)
        .get('/css/editPage.css')
        .set('Cookie', 'SID=1')
        .expect('Content-Type', /css/)
        .expect(/.popUp-window {/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the editPage.js for /js/editPage.js', done => {
      request(app)
        .get('/js/editPage.js')
        .set('Cookie', 'SID=1')
        .expect('Content-Type', /javascript/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give a todo for /todo', done => {
      const task = { id: 0, name: 'Testing', status: false };
      const todo = { name: 'Experimenting', tasks: [task], id: 1 };
      const expected = JSON.stringify(todo);
      request(app)
        .get('/todo')
        .set('referer', 'http://localhost:8000/editPage.html?todoId=1')
        .set('Cookie', 'SID=1')
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
      .expect(STATUS_CODES.NOT_FOUND, done);
  });
});

describe('Not Allowed Method', () => {
  it('should give 400 status code when the method is not allowed', done => {
    request(app)
      .put('/home.html')
      .expect('Content-Type', /html/)
      .expect(STATUS_CODES.NOT_FOUND, done);
  });
});

describe('POST', function() {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());
  it('should save the given new todo list for url /addNewTodo', done => {
    request(app)
      .post('/addNewTodo')
      .set('Content-Type', 'application/json')
      .set('Cookie', 'SID=1')
      .send(JSON.stringify({ name: 'new Todo' }))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should save the new task given with url /newTask', done => {
    const addedList = { todoId: '1', taskName: 'hai' };
    request(app)
      .post('/newTask')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(addedList))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete tasks for url /toggleStatus', done => {
    const body = { todoId: '1', taskId: '1' };
    request(app)
      .post('/toggleStatus')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect(STATUS_CODES.OK, done);
  });

  it('should edit the name of the task for url /editTask', done => {
    const body = { taskId: 1, todoId: 1, value: 'some' };
    request(app)
      .post('/editTask')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should edit the name of the todo for url /editTodo', done => {
    const body = { todoId: 1, value: 'some' };
    request(app)
      .post('/editTodo')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete tasks for url /deleteTask', done => {
    const deletedTask = { todoId: '1', taskId: '2' };
    request(app)
      .post('/deleteTask')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(deletedTask))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete the requested list from memory for url /delete', done => {
    request(app)
      .post('/delete')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ id: 1 }))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should redirect to home.html for successful login /login', done => {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ username: 'user', password: 'user' }))
      .expect(STATUS_CODES.FOUND, done);
  });
});

describe('POST', function() {
  it('should give 404 for unsuccessful login /login', done => {
    request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ username: 'user', password: 'wrong password' }))
      .expect(STATUS_CODES.NOT_FOUND, done);
  });

  it('should give Bad Request for POST not having required fields ', done => {
    request(app)
      .post('/newTask')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({}))
      .expect(STATUS_CODES.BAD_REQUEST, done);
  });
});

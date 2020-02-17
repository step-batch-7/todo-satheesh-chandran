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
const mockSessions = user => ({
  getUser: sinon.mock().returns(user),
  createSession: sinon.mock().returns(1),
  delete: sinon.mock().returns(true)
});

const mockUsers = () => ({
  john: {
    toJSON: sinon.mock().returns([todo]),
    findTodo: sinon.mock().returns(todo),
    addTodoTask: sinon.mock().returns(true),
    changeTaskStatus: sinon.mock().returns(true),
    editTaskName: sinon.mock().returns(true),
    editTodoName: sinon.mock().returns(true),
    deleteTodoTask: sinon.mock().returns(true)
  }
});

const todo = {
  name: 'Experimenting',
  tasks: [{ id: 0, name: 'Testing', status: false }],
  id: 1
};

describe('GET', function() {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());
  describe('home page', function() {
    it('should give the login.html for url / if user not logged in', done => {
      request(app)
        .get('/')
        .set('Accept', '*')
        .expect('Content-Type', /html/)
        .expect(/login/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should redirect login if unknown user access /user/home.html', done => {
      request(app)
        .get('/user/home.html')
        .expect(STATUS_CODES.FOUND, done);
    });

    it('should redirect to / if unknown user accessing home.css', done => {
      request(app)
        .get('/user/css/home.css')
        .expect(STATUS_CODES.FOUND, done);
    });

    it('should redirect to / if unknown user accessing home.js', done => {
      request(app)
        .get('/user/js/home.js')
        .expect(STATUS_CODES.FOUND, done);
    });

    it('should give home.html for valid user accessing home.html', done => {
      app.locals.sessions = mockSessions('john');
      request(app)
        .get('/user/home.html')
        .set('Cookie', 'SID=1')
        .expect(STATUS_CODES.OK, done)
        .expect('Content-Type', /html/);
    });

    it('should redirect to home.html for / if user logged in', done => {
      app.locals.sessions = mockSessions('john');
      request(app)
        .get('/')
        .set('Cookie', 'SID=1')
        .expect(STATUS_CODES.FOUND, done);
    });

    it('should give all todos if user logged in', done => {
      app.locals.sessions = mockSessions('john');
      app.locals.users = mockUsers();
      request(app)
        .get('/user/todos')
        .set('Cookie', 'SID=1')
        .expect(STATUS_CODES.OK, done)
        .expect('Content-Type', /json/)
        .expect(/Experimenting/);
    });

    it('should redirect to login for /user/todos if user not logged', done => {
      request(app)
        .get('/user/todos')
        .expect(STATUS_CODES.FOUND, done);
    });
  });

  describe('edit page', function() {
    it('should give the editPage.html for /editPage.html?todoId=1', done => {
      app.locals.sessions = mockSessions('john');
      request(app)
        .get('/user/editPage.html?todoId=1')
        .set('Cookie', 'SID=1')
        .expect('Content-Type', /html/)
        .expect(/<title>edit page<\/title>/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the editPage.css for /css/editPage.css', done => {
      app.locals.sessions = mockSessions('john');
      request(app)
        .get('/user/css/editPage.css')
        .set('Cookie', 'SID=1')
        .expect('Content-Type', /css/)
        .expect(/.popUp-window {/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give the editPage.js for /js/editPage.js', done => {
      app.locals.sessions = mockSessions('john');
      request(app)
        .get('/user/js/editPage.js')
        .set('Cookie', 'SID=1')
        .expect('Content-Type', /javascript/)
        .expect(STATUS_CODES.OK, done);
    });

    it('should give a todo for /todo', done => {
      const task = { id: 0, name: 'Testing', status: false };
      const todo = { name: 'Experimenting', tasks: [task], id: 1 };
      const expected = JSON.stringify(todo);
      app.locals.sessions = mockSessions('john');
      app.locals.users = mockUsers();
      request(app)
        .get('/user/todo')
        .set('referer', 'http://localhost:8000/editPage.html?todoId=1')
        .set('Cookie', 'SID=1')
        .expect('Content-Type', /json/)
        .expect(expected)
        .expect(STATUS_CODES.OK, done);
    });
    it('should redirect to login for /user/todo if user not logged', done => {
      request(app)
        .get('/user/todo')
        .set('referer', 'http://localhost:8000/editPage.html?todoId=1')
        .expect(STATUS_CODES.FOUND, done);
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
    app.locals.sessions = mockSessions('john');
    app.locals.users = { john: { addTodo: sinon.mock().returns(true) } };
    request(app)
      .post('/user/addNewTodo')
      .set('Content-Type', 'application/json')
      .set('Cookie', 'SID=1')
      .send(JSON.stringify({ name: 'new Todo' }))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should save the new task given with url /newTask', done => {
    const newTask = { todoId: '1', taskName: 'hai' };
    app.locals.sessions = mockSessions('john');
    app.locals.users = mockUsers();
    request(app)
      .post('/user/newTask')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(newTask))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should give Bad Request for POST not having required fields ', done => {
    app.locals.sessions = mockSessions('john');
    app.locals.users = mockUsers();
    request(app)
      .post('/user/newTask')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({}))
      .expect(STATUS_CODES.BAD_REQUEST, done);
  });

  it('should delete tasks for url /toggleStatus', done => {
    app.locals.sessions = mockSessions('john');
    app.locals.users = mockUsers();
    const body = { todoId: '1', taskId: '1' };
    request(app)
      .post('/user/toggleStatus')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect(STATUS_CODES.OK, done);
  });

  it('should edit the name of the task for url /editTask', done => {
    app.locals.sessions = mockSessions('john');
    app.locals.users = mockUsers();
    const body = { taskId: 1, todoId: 1, value: 'some' };
    request(app)
      .post('/user/editTask')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should edit the name of the todo for url /editTodo', done => {
    const body = { todoId: 1, value: 'some' };
    app.locals.sessions = mockSessions('john');
    app.locals.users = mockUsers();
    request(app)
      .post('/user/editTodo')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(body))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete the requested list from memory for url /delete', done => {
    app.locals.sessions = mockSessions('john');
    app.locals.users = {
      john: {
        findTodo: sinon.mock().returns(todo),
        deleteTodo: sinon.mock().returns(true)
      }
    };
    request(app)
      .post('/user/delete')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ id: 1 }))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should delete tasks for url /deleteTask', done => {
    const taskToRemove = { todoId: '1', taskId: '2' };
    app.locals.sessions = mockSessions('john');
    app.locals.users = mockUsers();
    request(app)
      .post('/user/deleteTask')
      .set('Cookie', 'SID=1')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(taskToRemove))
      .expect('Content-Type', /json/)
      .expect(STATUS_CODES.OK, done);
  });
});

describe('POST', function() {
  beforeEach(() => sinon.replace(fs, 'writeFileSync', () => {}));
  afterEach(() => sinon.restore());
  describe('login', function() {
    app.locals.userCredentials = { john: 'john' };
    it('should return isValid false for unsuccessful login /login', done => {
      request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ username: 'notValid', password: 'notValid' }))
        .expect('Content-Type', /json/)
        .expect(JSON.stringify({ isValid: false }))
        .expect(STATUS_CODES.OK, done);
    });

    it('should return isValid true for successful login /login', done => {
      app.locals.sessions = mockSessions('john');
      app.locals.userCredentials = { john: 'john' };
      request(app)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ username: 'john', password: 'john' }))
        .expect('Content-Type', /json/)
        .expect(JSON.stringify({ isValid: true }))
        .expect(STATUS_CODES.OK, done);
    });
  });

  describe('signup', function() {
    it('should return isValid false if username present for /signup', done => {
      app.locals.userCredentials = { john: 'john' };
      request(app)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ username: 'john', password: 'john' }))
        .expect('Content-Type', /json/)
        .expect(JSON.stringify({ isValid: false }))
        .expect(STATUS_CODES.OK, done);
    });

    it('should return isValid true if username not exist for /signup', done => {
      app.locals.userCredentials = {};
      request(app)
        .post('/signup')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ username: 'john', password: 'john' }))
        .expect('Content-Type', /json/)
        .expect(JSON.stringify({ isValid: true }))
        .expect(STATUS_CODES.OK, done);
    });
  });
});

describe('logout', function() {
  it('should redirect to login for /logout if user is logged', function(done) {
    app.locals.sessions = mockSessions('john');
    request(app)
      .get('/user/logout')
      .set('Cookie', 'SID=1')
      .expect(STATUS_CODES.FOUND, done);
  });
});

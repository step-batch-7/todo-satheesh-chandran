const request = require('supertest');
const sinon = require('sinon');
const fs = require('fs');
const { app } = require('../lib/handlers');

const STATUS_CODES = { OK: 200, METHOD_NOT_FOUND: 400, REDIRECT: 301 };

describe('GET request for static files', function() {
  it('should give the home page with url /', function(done) {
    request(app.serve.bind(app))
      .get('/')
      .expect('Content-Type', 'text/html')
      .expect(/\/css\/home.css/)
      .expect(STATUS_CODES.OK, done);
  });

  it('should give the home page with url /home.html', function(done) {
    request(app.serve.bind(app))
      .get('/home.html')
      .expect('Content-Type', 'text/html')
      .expect(/\/css\/home.css/)
      .expect(STATUS_CODES.OK, done);
  });
});

describe('GET request for non existing files', function() {
  it('should return a 404 message ', function(done) {
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

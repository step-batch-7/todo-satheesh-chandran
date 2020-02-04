const request = require('supertest');
// const sinon = require('sinon');
// const fs = require('fs');
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

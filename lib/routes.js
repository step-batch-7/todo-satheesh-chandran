const express = require('express');
const cookieParser = require('cookie-parser');
const { loadTodos, loadCredentials } = require('./fileSystems');
const Sessions = require('../lib/sessions');
const userRouter = require('./userRouter');
const {
  redirectToHome,
  findUser,
  parseUsers,
  hasFields,
  signUp,
  loginUser
} = require('./handlers');

const app = express();
app.locals.sessions = new Sessions();
app.locals.users = parseUsers(loadTodos());
app.locals.userCredentials = JSON.parse(loadCredentials());

app.use(cookieParser());
app.use(findUser);
app.get([/^\/$/, '/login.html'], redirectToHome);
app.use(express.static('public', { index: 'login.html' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);
app.post('/signup', hasFields('username', 'password'), signUp);
app.post('/login', hasFields('username', 'password'), loginUser);

module.exports = { app };

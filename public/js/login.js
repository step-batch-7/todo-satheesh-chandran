const sendXHR = function(method, url, callback, message = '') {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200) {
      callback(JSON.parse(this.responseText));
    }
  };
  req.open(method, url);
  method === 'POST' && req.setRequestHeader('Content-type', 'application/json');
  req.send(message);
};

const toggleWindow = function() {
  if (event.target.innerHTML === 'Sign Up') {
    document.querySelector('.signup-window').classList.remove('invisible');
    document.querySelector('.login-window').classList.add('invisible');
    return;
  }
  document.querySelector('.signup-window').classList.add('invisible');
  document.querySelector('.login-window').classList.remove('invisible');
};

const showUserErr = function({ isPresent }) {
  if (isPresent) {
    document
      .querySelector('#signup-name')
      .previousElementSibling.classList.remove('hide');
    return;
  }
  document
    .querySelector('#signup-name')
    .previousElementSibling.classList.add('hide');
};

const checkValidUser = function({ isValid }) {
  if (!isValid) {
    document.querySelector('h5').classList.remove('hide');
    return;
  }
  document.location = '/user/home.html';
};

const login = function() {
  const username = document.querySelector('#login-username').value;
  const password = document.querySelector('#login-password').value;
  const body = JSON.stringify({ username, password });
  sendXHR('POST', '/login', checkValidUser, body);
};

const toggleErr = function(err) {
  const errors = {
    name: '#name-err',
    confirm: '#confirm-err',
    password: '#password-err'
  };
  const error = errors[err];
  document.querySelector(error).classList.remove('hide');
  setTimeout(() => document.querySelector(error).classList.add('hide'), 2000);
};

const checkValidName = function({ isValid }) {
  if (!isValid) {
    return toggleErr('name');
  }
  document.location = '/';
};

const signup = function() {
  const username = document.querySelector('#signup-name').value;
  const password = document.querySelector('#signup-password').value;
  const confirm = document.querySelector('#signup-confirm').value;
  if (password.length < 8) {
    return toggleErr('password');
  }
  if (password === confirm) {
    const body = JSON.stringify({ username, password });
    return sendXHR('POST', '/signup', checkValidName, body);
  }
  toggleErr('confirm');
};

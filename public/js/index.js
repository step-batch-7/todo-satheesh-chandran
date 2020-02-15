const sendXHR = function(method, url, callback, message = '') {
  const req = new XMLHttpRequest();
  req.onload = function() {
    if (this.status === 200) {
      console.log(this);
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

const checkUserName = function() {
  const username = event.target.value;
  sendXHR('POST', '/checkUserName', showUserErr, JSON.stringify({ username }));
};

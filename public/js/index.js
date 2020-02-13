const toggleWindow = function() {
  if (event.target.innerHTML === 'Sign Up') {
    document.querySelector('.signup-window').classList.remove('invisible');
    document.querySelector('.login-window').classList.add('invisible');
    return;
  }
  document.querySelector('.signup-window').classList.add('invisible');
  document.querySelector('.login-window').classList.remove('invisible');
};

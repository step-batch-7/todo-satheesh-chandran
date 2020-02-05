// const requestForJSON = function() {};

const requestForId = function() {
  const req = new XMLHttpRequest();
  req.onload = function() {
    console.log(this.responseText);
  };
  req.open('GET', '/tasks');
  req.send();
};

window.onload = requestForId;

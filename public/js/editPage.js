// const requestForJSON = function() {};

const requestForId = function() {
  const req = new XMLHttpRequest();
  req.onload = function() {
    console.log(this.response);
  };
  req.open('GET', '/tasks');
  req.send();
};

// window.HTMLBodyElement.onload = requestForId;

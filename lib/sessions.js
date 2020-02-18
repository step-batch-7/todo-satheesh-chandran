const generateId = function() {
  let id = 1;
  return () => id++;
};

const getId = generateId();

class Sessions {
  constructor() {
    this.sessions = {};
  }

  createSession(name) {
    const id = getId();
    this.sessions[id] = name;
    return id;
  }

  getUser(id) {
    return this.sessions[+id];
  }

  delete(id) {
    return delete this.sessions[id];
  }
}

module.exports = Sessions;

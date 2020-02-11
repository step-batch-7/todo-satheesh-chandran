class Users {
  constructor(userName, password) {
    this.password = password;
    this.userName = userName;
    this.todos = [];
  }
}

module.exports = { Users };

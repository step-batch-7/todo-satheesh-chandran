class Tasks {
  constructor() {
    this.tasks = 0;
  }
}

class Todo {
  constructor(name, tasks, id = +'0') {
    this.name = name;
    this.tasks = tasks;
    this.id = id;
  }

  setId() {
    this.id = this.id++;
  }
}

class TodoRecords {
  constructor() {
    this.todoLists = [];
  }

  addTodo(newTodo) {
    this.todoLists.push(newTodo);
  }

  static loadTodo(todoLists) {
    const todoRecords = new TodoRecords();
    console.log(todoLists);
    todoLists.forEach(singleList => {
      const newTodo = new Todo(
        singleList.name,
        singleList.tasks,
        singleList.id
      );
      todoRecords.addTodo(newTodo);
    });
    return todoRecords;
  }
}

module.exports = { TodoRecords, Tasks, Todo };

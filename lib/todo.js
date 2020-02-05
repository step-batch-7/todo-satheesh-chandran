class Tasks {
  constructor(name, status) {
    this.name = name;
    this.status = status;
    this.id = 0;
  }
}

class Todo {
  constructor(name, tasks, id = 0) {
    this.name = name;
    this.tasks = tasks;
    this.id = id;
  }

  setTaskId() {
    const tasks = this.tasks;
    tasks.forEach((task, index) => {
      task.id = `${this.id}_${index}`;
    });
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
    todoLists.forEach(singleList => {
      const newTodo = new Todo(
        singleList.name,
        singleList.tasks,
        singleList.id
      );
      // newTodo.setTaskId();
      todoRecords.addTodo(newTodo);
    });
    return todoRecords;
  }
}

module.exports = { TodoRecords, Tasks, Todo };

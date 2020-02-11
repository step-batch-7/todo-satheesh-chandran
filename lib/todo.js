const duplicatTasks = function({ name, status }, index) {
  return { id: index, name, status };
};

const duplicate = function({ id, name, tasks }) {
  return { id, name, tasks: tasks.map(duplicatTasks) };
};

class Todo {
  constructor(name, tasks, id = 0) {
    this.name = name;
    this.tasks = tasks;
    this.id = id;
  }

  generateId() {
    const task = this.tasks[this.tasks.length - 1] || { id: 0 };
    return task.id + 1;
  }

  static create(todo) {
    const { id, name, tasks } = duplicate(todo);
    return new Todo(name, tasks, id);
  }
}

class TodoRecords {
  constructor() {
    this.todoLists = [];
  }
  findTodo(id) {
    return this.todoLists.find(todo => todo.id === +id);
  }

  deleteTodo(id) {
    const todoIndex = this.todoLists.findIndex(todo => todo.id === +id);
    this.todoLists.splice(todoIndex, 1);
  }
  addTodo(todo) {
    todo.id = this.generateId();
    this.todoLists.push(Todo.create(todo));
  }

  generateId() {
    const todo = this.todoLists[this.todoLists.length - 1];
    return todo ? todo.id + 1 : 1;
  }

  replaceTasks(editedList) {
    this.todoLists.forEach(todo => {
      if (`${todo.id}` === editedList.id) {
        todo.tasks = editedList.tasks;
        todo.name = editedList.name;
      }
    });
  }

  static loadTodo(todoLists) {
    const todoRecords = new TodoRecords();
    todoLists.forEach(todo => {
      const newTodo = new Todo(todo.name, todo.tasks, todo.id);
      todoRecords.addTodo(newTodo);
    });
    return todoRecords;
  }
}

module.exports = { TodoRecords, Todo };

const duplicatTasks = function({ id, name, status }) {
  return { id, name, status };
};

const duplicate = function({ id, name, tasks }) {
  return { id, name, tasks: tasks.map(duplicatTasks) };
};

class Todo {
  constructor(name, tasks, id) {
    this.name = name;
    this.tasks = tasks;
    this.id = id;
  }

  findTask(id) {
    return this.tasks.find(task => task.id === +id);
  }

  changeStatus(id) {
    const task = this.findTask(id);
    if (task) {
      task.status = !task.status;
      return true;
    }
    return false;
  }

  deleteTask(id) {
    const taskIndex = this.tasks.findIndex(task => task.id === +id);
    if (taskIndex < 0) {
      return false;
    }
    this.tasks.splice(taskIndex, 1);
    return true;
  }

  generateId() {
    const task = this.tasks[this.tasks.length - 1];
    return task ? task.id + 1 : 0;
  }
  addTask(name) {
    const task = { name, status: false, id: this.generateId() };
    this.tasks.push(task);
    return true;
  }

  editTask(id, name) {
    const task = this.findTask(id);
    if (task) {
      task.name = name;
      return true;
    }
    return false;
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
    if (todoIndex < 0) {
      return false;
    }
    this.todoLists.splice(todoIndex, 1);
    return true;
  }

  addTodo(todo) {
    todo.id = this.generateId();
    this.todoLists.push(Todo.create(todo));
    return true;
  }

  generateId() {
    const todo = this.todoLists[this.todoLists.length - 1];
    return todo ? todo.id + 1 : 1;
  }
  addTodoTask(todoId, taskname) {
    const todo = this.findTodo(todoId);
    if (!todo) {
      return false;
    }
    return todo.addTask(taskname);
  }

  editTodoName(todoId, title) {
    const todo = this.findTodo(todoId);
    if (todo) {
      todo.name = title;
      return true;
    }
    return false;
  }

  editTaskName(todoId, taskId, name) {
    const todo = this.findTodo(todoId);
    if (!todo) {
      return false;
    }
    return todo.editTask(taskId, name);
  }

  changeTaskStatus(todoId, taskId) {
    const todo = this.findTodo(todoId);
    if (!todo) {
      return false;
    }
    return todo.changeStatus(taskId);
  }

  deleteTodoTask(todoId, taskId) {
    const todo = this.findTodo(todoId);
    if (!todo) {
      return false;
    }
    return todo.deleteTask(taskId);
  }

  toJSON() {
    return JSON.stringify(this.todoLists);
  }
  static loadTodo(todoLists) {
    const todoRecords = new TodoRecords();
    todoLists.forEach(todo => {
      todoRecords.addTodo(todo);
    });
    return todoRecords;
  }
}

module.exports = { TodoRecords, Todo };

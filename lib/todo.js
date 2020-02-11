const duplicatTasks = function({ name, status }, index) {
  return { id: index, name, status };
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
    task.status = !task.status;
  }

  deleteTask(id) {
    const taskIndex = this.tasks.findIndex(task => task.id === +id);
    this.tasks.splice(taskIndex, 1);
  }

  generateId() {
    const task = this.tasks[this.tasks.length - 1];
    return task ? task.id + 1 : 0;
  }
  addTask(name) {
    const task = { name, status: false, id: this.generateId() };
    this.tasks.push(task);
  }

  editTask(id, name) {
    const task = this.findTask(id);
    task.name = name;
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
  addTodoTask(todoId, taskname) {
    const todo = this.findTodo(todoId);
    todo.addTask(taskname);
  }

  editTodoName(todoId, title) {
    const todo = this.findTodo(todoId);
    todo.name = title;
  }

  editTaskName(todoId, taskId, name) {
    const todo = this.findTodo(todoId);
    todo.editTask(taskId, name);
  }

  changeTaskStatus(todoId, taskId) {
    const todo = this.findTodo(todoId);
    todo.changeStatus(taskId);
  }

  deleteTodoTask(todoId, taskId) {
    const todo = this.findTodo(todoId);
    todo.deleteTask(taskId);
  }
  toJSON() {
    return JSON.stringify(this.todoLists);
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

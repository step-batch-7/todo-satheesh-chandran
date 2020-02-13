const fs = require('fs');
const { TodoRecords } = require('./todo');
const CONTENT_TYPES = require('./mimeTypes');
const LIST_STORE = './data/todo.json';
const { loadTodos } = require('./fileSystems');

const TODOS = TodoRecords.loadTodo(JSON.parse(loadTodos()));

const serveTodos = function(req, res) {
  const content = TODOS.toJSON();
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(content);
};

const addNewTodo = function(req, res) {
  const { name } = req.body;
  TODOS.addTodo({ name, tasks: [] });
  fs.writeFileSync(LIST_STORE, TODOS.toJSON(), 'utf8');
  serveTodos(req, res);
};

const deleteTodo = function(req, res) {
  const { id } = req.body;
  TODOS.deleteTodo(id);
  fs.writeFileSync(LIST_STORE, TODOS.toJSON(), 'utf8');
  serveTodos(req, res);
};

const serveRefererTodo = function(req, res) {
  const [, id] = req.headers.referer.split('=');
  serveTodo(req, res, id);
};

const serveTodo = function(req, res, todoId) {
  const todo = TODOS.findTodo(todoId);
  fs.writeFileSync(LIST_STORE, TODOS.toJSON(), 'utf8');
  res.setHeader('Content-Type', CONTENT_TYPES.json);
  res.end(JSON.stringify(todo));
};

const addNewTask = function(req, res) {
  const { taskName, todoId } = req.body;
  TODOS.addTodoTask(todoId, taskName);
  serveTodo(req, res, todoId);
};

const deleteTask = function(req, res) {
  const { todoId, taskId } = req.body;
  TODOS.deleteTodoTask(todoId, taskId);
  serveTodo(req, res, todoId);
};

const toggleTaskStatus = function(req, res) {
  const { todoId, taskId } = req.body;
  TODOS.changeTaskStatus(todoId, taskId);
  serveTodo(req, res, todoId);
};

const editTask = function(req, res) {
  const { todoId, taskId, value } = req.body;
  TODOS.editTaskName(todoId, taskId, value);
  serveTodo(req, res, todoId);
};

const editTodo = function(req, res) {
  const { todoId, value } = req.body;
  TODOS.editTodoName(todoId, value);
  serveTodo(req, res, todoId);
};

module.exports = {
  serveTodos,
  serveRefererTodo,
  toggleTaskStatus,
  deleteTask,
  addNewTask,
  addNewTodo,
  deleteTodo,
  editTask,
  editTodo
};

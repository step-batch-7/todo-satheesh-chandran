const express = require('express');
const {
  serveTodos,
  serveRefererTodo,
  toggleTaskStatus,
  deleteTask,
  addNewTask,
  addNewTodo,
  deleteTodo,
  editTask,
  editTodo,
  doesUserNamePresent,
  hasFields
} = require('./handlers');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.get('/todos', serveTodos);
app.get('/todo', serveRefererTodo);

app.post('/checkUserName', hasFields('username'), doesUserNamePresent);
app.post('/toggleStatus', hasFields('todoId', 'taskId'), toggleTaskStatus);
app.post('/deleteTask', hasFields('todoId', 'taskId'), deleteTask);
app.post('/newTask', hasFields('taskName', 'todoId'), addNewTask);
app.post('/addNewTodo', hasFields('name'), addNewTodo);
app.post('/delete', hasFields('id'), deleteTodo);
app.post('/editTask', hasFields('todoId', 'taskId', 'value'), editTask);
app.post('/editTodo', hasFields('todoId', 'value'), editTodo);

module.exports = { app };

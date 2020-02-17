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
  hasFields,
  findUserTodos,
  logout,
  shouldBeLoggedIn
} = require('./handlers');
const router = express.Router();

router.use(shouldBeLoggedIn);
router.use(express.static('private', { index: 'home.html' }));
router.use(findUserTodos);
router.get('/todos', serveTodos);
router.get('/todo', serveRefererTodo);
router.get('/logout', logout);

router.post('/toggleStatus', hasFields('todoId', 'taskId'), toggleTaskStatus);
router.post('/deleteTask', hasFields('todoId', 'taskId'), deleteTask);
router.post('/newTask', hasFields('taskName', 'todoId'), addNewTask);
router.post('/addNewTodo', hasFields('name'), addNewTodo);
router.post('/delete', hasFields('id'), deleteTodo);
router.post('/editTask', hasFields('todoId', 'taskId', 'value'), editTask);
router.post('/editTodo', hasFields('todoId', 'value'), editTodo);

module.exports = router;

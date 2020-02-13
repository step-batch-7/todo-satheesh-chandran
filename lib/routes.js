const express = require('express');
const handlers = require('./handlers');

const app = express();

app.use(express.json());
app.use(express.static('public', { index: 'home.html' }));
app.get('/todos', handlers.serveTodos);
app.get('/todo', handlers.serveRefererTodo);

app.post('/toggleStatus', handlers.toggleTaskStatus);
app.post('/deleteTask', handlers.deleteTask);
app.post('/newTask', handlers.addNewTask);
app.post('/addNewTodo', handlers.addNewTodo);
app.post('/delete', handlers.deleteTodo);
app.post('/editTask', handlers.editTask);
app.post('/editTodo', handlers.editTodo);

module.exports = { app };

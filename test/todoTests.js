const { assert } = require('chai');
const { TodoRecords, Todo } = require('../lib/todo');

describe('Todo', function() {
  describe('static create', function() {
    it('should create instance of Todo', function() {
      const obj = { id: 1, tasks: [], name: 'somename' };
      const todo = new Todo(obj.name, obj.tasks, obj.id);
      const createdTodo = Todo.create(obj);
      assert.isTrue(createdTodo instanceof Todo);
      assert.deepStrictEqual(createdTodo, todo);
    });
  });

  describe('addTask', function() {
    it('should give true for adding a task to todo', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      assert.isTrue(todo.addTask('new'));
    });
  });

  describe('deleteTask', function() {
    it('should give true for deleting a task present in todo', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      assert.isTrue(todo.addTask('new'));
      assert.isTrue(todo.deleteTask(0));
    });

    it('should give false for deleting non existing task in todo', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      assert.isFalse(todo.deleteTask(0));
    });
  });

  describe('findTask', function() {
    it('should give the task that has id 0', function() {
      const task = { id: 0, name: 'new', status: false };
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      todo.addTask('new');
      assert.deepStrictEqual(todo.findTask(0), task);
    });

    it('should give undefined for the task that is not existing', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      todo.addTask('new');
      assert.isUndefined(todo.findTask(10));
    });
  });
});

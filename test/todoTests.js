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

  describe('generateId', function() {
    it('should return zero if the tasks are empty ', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      assert.equal(todo.generateId(), 0);
    });

    it('should return 1 if the latest task has id 0', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      todo.addTask('new');
      assert.equal(todo.generateId(), 1);
    });
  });

  describe('editTask', function() {
    it('should return true if the task name is edited', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      todo.addTask('new');
      assert.isTrue(todo.editTask(0, 'hii'));
      const expected = { id: 0, name: 'hii', status: false };
      assert.deepStrictEqual(todo.findTask(0), expected);
    });

    it('should return false if the task is not present to edit', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      assert.isFalse(todo.editTask(10, 'hii'));
    });
  });

  describe('changeStatus', function() {
    it('should give true for the task status is changed', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      todo.addTask('new');
      assert.isTrue(todo.changeStatus(0));
      const expected = { id: 0, name: 'new', status: true };
      assert.deepStrictEqual(todo.findTask(0), expected);
      assert.isTrue(todo.changeStatus(0));
      expected.status = false;
      assert.deepStrictEqual(todo.findTask(0), expected);
    });

    it('should give false if task is not exists to change status', function() {
      const todo = Todo.create({ id: 1, tasks: [], name: 'somename' });
      assert.isFalse(todo.changeStatus(10));
    });
  });
});

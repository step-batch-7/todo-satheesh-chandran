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

describe('TodoRecords', function() {
  describe('static loadTodo', function() {
    it('should load all the ', function() {
      const todoLists = [{ id: 1, tasks: [], name: 'some' }];
      const todos = { todoLists };
      const todoRecords = TodoRecords.loadTodo(todoLists);
      assert.isTrue(todoRecords instanceof TodoRecords);
      assert.deepStrictEqual(todoRecords, todos);
    });
  });

  describe('generateId', function() {
    it('should return one if the tasks are empty ', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.equal(todoRecords.generateId(), 1);
    });

    it('should return 2 if the latest task has id 1', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      assert.equal(todoRecords.generateId(), 2);
    });
  });

  describe('addTodo', function() {
    it('should give true for adding new todo', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.isTrue(todoRecords.addTodo({ name: 'new', tasks: [] }));
    });
  });

  describe('deleteTodo', function() {
    it('should give true for deleting an existing todo', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      assert.isTrue(todoRecords.deleteTodo(1));
    });

    it('should give false for deleting non existing todo', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.isFalse(todoRecords.deleteTodo(10));
    });
  });

  describe('findTodo', function() {
    it('should give the matching todo with the id given', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      const expected = { name: 'new', tasks: [], id: 1 };
      assert.deepStrictEqual(todoRecords.findTodo(1), expected);
    });
    it('should give the undefined if the todo not found', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.isUndefined(todoRecords.findTodo(1));
    });
  });

  describe('editTodoName', function() {
    it('should give tue for editing name of the todo', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      assert.isTrue(todoRecords.editTodoName(1, 'new Name'));
    });

    it('should give false if the todo is not present to edit', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.isFalse(todoRecords.editTodoName(1, 'new Name'));
    });
  });

  describe('addTodoTask', function() {
    it('should give true for adding new task for existing todo', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      assert.isTrue(todoRecords.addTodoTask(1, 'new task'));
    });

    it('should give false if the todo is not present', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.isFalse(todoRecords.addTodoTask(1, 'new task'));
    });
  });

  describe('editTaskName', function() {
    it('should give true for editing task name of a todo', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      todoRecords.addTodoTask(1, 'new task');
      assert.isTrue(todoRecords.editTaskName(1, 0, 'other name'));
    });

    it('should give false for editing task if todo is not present', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.isFalse(todoRecords.editTaskName(1, 0, 'other name'));
    });

    it('should give false for editing task if task is not present', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      assert.isFalse(todoRecords.editTaskName(1, 10, 'other name'));
    });
  });

  describe('changeTaskStatus', function() {
    it('should give true for changing the status of the task', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      todoRecords.addTodoTask(1, 'new task');
      assert.isTrue(todoRecords.changeTaskStatus(1, 0));
    });

    it('should give false for changing status if task not exists', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      assert.isFalse(todoRecords.changeTaskStatus(1, 10));
    });

    it('should give false for changing status if todo not exists', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.isFalse(todoRecords.changeTaskStatus(10, 0));
    });
  });

  describe('deleteTodoTask', function() {
    it('should give true for deleting the task present', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      todoRecords.addTodoTask(1, 'new task');
      assert.isTrue(todoRecords.deleteTodoTask(1, 0));
    });

    it('should give false for deleting the task not present', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      assert.isFalse(todoRecords.deleteTodoTask(1, 10));
    });

    it('should give false for deleting the task of todo not exist', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      assert.isFalse(todoRecords.deleteTodoTask(10, 10));
    });
  });
});

describe('TodoRecords', function() {
  describe('toJSON', function() {
    it('should give json of existing todos', function() {
      const todoRecords = TodoRecords.loadTodo([]);
      todoRecords.addTodo({ name: 'new', tasks: [] });
      const expected = JSON.stringify([{ name: 'new', tasks: [], id: 1 }]);
      assert.strictEqual(todoRecords.toJSON(), expected);
    });
  });
});

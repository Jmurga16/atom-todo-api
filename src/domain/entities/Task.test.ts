import { TaskFactory, CreateTaskDTO, UpdateTaskDTO, Task } from './Task';

describe('TaskFactory', () => {
  describe('create', () => {
    it('should create a task with trimmed title and description', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: '  My Task  ',
        description: '  Description  ',
      };

      const task = TaskFactory.create(dto);

      expect(task.userId).toBe('user123');
      expect(task.title).toBe('My Task');
      expect(task.description).toBe('Description');
      expect(task.completed).toBe(false);
      expect(task.active).toBe(true);
      expect(task.createdAt).toBeInstanceOf(Date);
      expect(task.updatedAt).toBeInstanceOf(Date);
    });

    it('should create a task with default completed status as false', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: 'Task',
        description: 'Desc',
      };

      const task = TaskFactory.create(dto);

      expect(task.completed).toBe(false);
      expect(task.active).toBe(true);
    });
  });

  describe('update', () => {
    const baseTask: Task = {
      id: 'task123',
      userId: 'user123',
      title: 'Original Title',
      description: 'Original Description',
      completed: false,
      active: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    };

    it('should update only the title', () => {
      const dto: UpdateTaskDTO = { title: '  New Title  ' };
      const updated = TaskFactory.update(baseTask, dto);

      expect(updated.title).toBe('New Title');
      expect(updated.description).toBe('Original Description');
      expect(updated.completed).toBe(false);
      expect(updated.updatedAt).not.toEqual(baseTask.updatedAt);
    });

    it('should update only the description', () => {
      const dto: UpdateTaskDTO = { description: '  New Description  ' };
      const updated = TaskFactory.update(baseTask, dto);

      expect(updated.title).toBe('Original Title');
      expect(updated.description).toBe('New Description');
      expect(updated.completed).toBe(false);
    });

    it('should update completion status', () => {
      const dto: UpdateTaskDTO = { completed: true };
      const updated = TaskFactory.update(baseTask, dto);

      expect(updated.completed).toBe(true);
      expect(updated.title).toBe('Original Title');
      expect(updated.description).toBe('Original Description');
    });

    it('should update multiple fields at once', () => {
      const dto: UpdateTaskDTO = {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true,
      };
      const updated = TaskFactory.update(baseTask, dto);

      expect(updated.title).toBe('Updated Title');
      expect(updated.description).toBe('Updated Description');
      expect(updated.completed).toBe(true);
    });

    it('should preserve original values when dto fields are undefined', () => {
      const dto: UpdateTaskDTO = {};
      const updated = TaskFactory.update(baseTask, dto);

      expect(updated.title).toBe(baseTask.title);
      expect(updated.description).toBe(baseTask.description);
      expect(updated.completed).toBe(baseTask.completed);
    });
  });

  describe('validate', () => {
    it('should validate a correct CreateTaskDTO', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: 'Valid Title',
        description: 'Valid description',
      };

      const errors = TaskFactory.validate(dto);

      expect(errors).toEqual([]);
    });

    it('should reject empty title', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: '',
        description: 'Description',
      };

      const errors = TaskFactory.validate(dto);

      expect(errors).toContain('Title is required');
    });

    it('should reject title with only whitespace', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: '   ',
        description: 'Description',
      };

      const errors = TaskFactory.validate(dto);

      expect(errors).toContain('Title is required');
    });

    it('should reject title longer than 100 characters', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: 'a'.repeat(101),
        description: 'Description',
      };

      const errors = TaskFactory.validate(dto);

      expect(errors).toContain('Title must be less than 100 characters');
    });

    it('should reject description longer than 500 characters', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: 'Valid Title',
        description: 'a'.repeat(501),
      };

      const errors = TaskFactory.validate(dto);

      expect(errors).toContain('Description must be less than 500 characters');
    });

    it('should accept description up to 500 characters', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: 'Valid Title',
        description: 'a'.repeat(500),
      };

      const errors = TaskFactory.validate(dto);

      expect(errors).toEqual([]);
    });

    it('should validate UpdateTaskDTO with partial fields', () => {
      const dto: UpdateTaskDTO = {
        title: 'Updated Title',
      };

      const errors = TaskFactory.validate(dto);

      expect(errors).toEqual([]);
    });

    it('should collect multiple validation errors', () => {
      const dto: CreateTaskDTO = {
        userId: 'user123',
        title: '',
        description: 'a'.repeat(501),
      };

      const errors = TaskFactory.validate(dto);

      expect(errors).toHaveLength(2);
      expect(errors).toContain('Title is required');
      expect(errors).toContain('Description must be less than 500 characters');
    });
  });
});

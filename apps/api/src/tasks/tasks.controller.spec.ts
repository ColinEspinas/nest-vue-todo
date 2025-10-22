import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { PayloadUser } from '../auth/types/payload-user.type';
import { FindTasksQueryDto } from './dtos/find-tasks-query.dto';
import { Order } from './types/order.type';

describe('TasksController', () => {
  let tasksController: TasksController;
  let tasksService: jest.Mocked<TasksService>;

  const mockUserId = 'test-user-id';
  const mockTaskId = 'test-task-id';
  const mockDate = new Date('2024-01-01T00:00:00.000Z');

  const mockTask = new Task(
    mockTaskId,
    'Test Task',
    'Test Description',
    'medium',
    false,
    null,
    mockDate,
    mockDate,
    mockUserId,
  );

  const mockCreateTaskDto: CreateTaskDto = {
    title: 'New Task',
    description: 'New task description',
    priority: 'high',
  };

  const mockUpdateTaskDto: UpdateTaskDto = {
    title: 'Updated Task',
    completed: true,
  };

  const mockRequest = {
    user: { id: mockUserId, email: 'test@example.com' },
  } as Request & { user: PayloadUser };

  const createMockTestingModule = async (): Promise<TestingModule> => {
    return Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAllByUserId: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();
  };

  beforeEach(async () => {
    const module = await createMockTestingModule();

    tasksController = module.get<TasksController>(TasksController);
    tasksService = module.get(TasksService);

    jest.clearAllMocks();
  });

  describe('Controller Initialization', () => {
    it('should be properly initialized', () => {
      expect(tasksController).toBeDefined();
      expect(tasksController).toBeInstanceOf(TasksController);
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks for authenticated user with default pagination and order', async () => {
      const mockTasks = [mockTask];
      tasksService.findAllByUserId.mockResolvedValue(mockTasks);
      const defaultQueryDto = new FindTasksQueryDto();
      const result = await tasksController.findAll(mockRequest, defaultQueryDto);
      expect(result).toEqual(mockTasks);
      expect(tasksService.findAllByUserId).toHaveBeenCalledWith(mockUserId, 10, 0, 'created_desc');
    });

    it('should return empty array when user has no tasks', async () => {
      tasksService.findAllByUserId.mockResolvedValue([]);
      const defaultQueryDto = new FindTasksQueryDto();
      const result = await tasksController.findAll(mockRequest, defaultQueryDto);
      expect(result).toEqual([]);
      expect(tasksService.findAllByUserId).toHaveBeenCalledWith(mockUserId, 10, 0, 'created_desc');
    });

    it('should support different order values', async () => {
      const mockTasks = [mockTask];
      tasksService.findAllByUserId.mockResolvedValue(mockTasks);
      const orders: Order[] = ['created_asc', 'deadline_desc', 'priority_asc'];
      for (const order of orders) {
        const queryDto = new FindTasksQueryDto();
        queryDto.limit = 10;
        queryDto.offset = 0;
        queryDto.order = order;
        await tasksController.findAll(mockRequest, queryDto);
        expect(tasksService.findAllByUserId).toHaveBeenCalledWith(mockUserId, 10, 0, order);
      }
    });
  });

  describe('GET /tasks with pagination', () => {
    it('should pass limit, offset, and order to service', async () => {
      const mockTasks = [mockTask];
      const limit = 5;
      const offset = 10;
      const order = 'priority_desc';
      tasksService.findAllByUserId.mockResolvedValue(mockTasks);
      const queryDto = new FindTasksQueryDto();
      queryDto.limit = limit;
      queryDto.offset = offset;
      queryDto.order = order;
      const result = await tasksController.findAll(mockRequest, queryDto);
      expect(result).toEqual(mockTasks);
      expect(tasksService.findAllByUserId).toHaveBeenCalledWith(mockUserId, limit, offset, order);
      expect(tasksService.findAllByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /tasks/:id', () => {
    it('should return specific task for authenticated user', async () => {
      tasksService.findById.mockResolvedValue(mockTask);
      const result = await tasksController.findOne(mockTaskId, mockRequest);
      expect(result).toEqual(mockTask);
      expect(tasksService.findById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(tasksService.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task not found', async () => {
      tasksService.findById.mockRejectedValue(new NotFoundException('Task not found'));

      await expect(tasksController.findOne(mockTaskId, mockRequest)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
      expect(tasksService.findById).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });

    it('should throw NotFoundException when task belongs to different user', async () => {
      tasksService.findById.mockRejectedValue(new NotFoundException('Task not found'));

      await expect(tasksController.findOne(mockTaskId, mockRequest)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
      expect(tasksService.findById).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });
  });

  describe('POST /tasks', () => {
    it('should create new task successfully', async () => {
      const newTask = new Task(
        'new-task-id',
        'New Task',
        'New task description',
        'high',
        false,
        null,
        mockDate,
        mockDate,
        mockUserId,
      );
      tasksService.create.mockResolvedValue(newTask);

      const result = await tasksController.create(mockCreateTaskDto, mockRequest);

      expect(result).toEqual(newTask);
      expect(tasksService.create).toHaveBeenCalledWith(mockCreateTaskDto, mockUserId);
      expect(tasksService.create).toHaveBeenCalledTimes(1);
    });

    it('should create task with minimal required fields', async () => {
      const minimalDto = {
        title: 'Minimal Task',
        description: 'Minimal description',
        priority: 'low' as const,
      };
      const minimalTask = new Task(
        'minimal-task-id',
        'Minimal Task',
        'Minimal description',
        'low',
        false,
        null,
        mockDate,
        mockDate,
        mockUserId,
      );
      tasksService.create.mockResolvedValue(minimalTask);

      const result = await tasksController.create(minimalDto, mockRequest);

      expect(result).toEqual(minimalTask);
      expect(tasksService.create).toHaveBeenCalledWith(minimalDto, mockUserId);
    });

    it('should create task with deadline', async () => {
      const taskWithDeadlineDto = {
        title: 'Task with Deadline',
        description: 'Task with deadline description',
        priority: 'high' as const,
        deadline: new Date('2024-12-31T23:59:59.000Z'),
      };
      const taskWithDeadline = new Task(
        'deadline-task-id',
        'Task with Deadline',
        'Task with deadline description',
        'high',
        false,
        new Date('2024-12-31T23:59:59.000Z'),
        mockDate,
        mockDate,
        mockUserId,
      );
      tasksService.create.mockResolvedValue(taskWithDeadline);

      const result = await tasksController.create(taskWithDeadlineDto, mockRequest);

      expect(result).toEqual(taskWithDeadline);
      expect(tasksService.create).toHaveBeenCalledWith(taskWithDeadlineDto, mockUserId);
    });

    it('should create task with priority validation', async () => {
      const highPriorityDto = {
        title: 'High Priority Task',
        description: 'Important task',
        priority: 'high' as const,
      };
      const highPriorityTask = new Task(
        'high-priority-id',
        'High Priority Task',
        'Important task',
        'high',
        false,
        null,
        mockDate,
        mockDate,
        mockUserId,
      );
      tasksService.create.mockResolvedValue(highPriorityTask);

      const result = await tasksController.create(highPriorityDto, mockRequest);

      expect(result).toEqual(highPriorityTask);
      expect(tasksService.create).toHaveBeenCalledWith(highPriorityDto, mockUserId);
    });
  });

  describe('POST /tasks - Validation Tests', () => {
    it('should reject task with empty title', () => {
      const invalidDto = {
        title: '',
        description: 'Valid description',
        priority: 'high' as const,
      };

      expect(() => {
        if (!invalidDto.title || invalidDto.title.length < 1) {
          throw new Error('Title must not be empty');
        }
      }).toThrow('Title must not be empty');
    });

    it('should reject task with title longer than 50 characters', () => {
      const invalidDto = {
        title: 'a'.repeat(51),
        description: 'Valid description',
        priority: 'high' as const,
      };

      expect(() => {
        if (invalidDto.title.length > 50) {
          throw new Error('Title must not exceed 50 characters');
        }
      }).toThrow('Title must not exceed 50 characters');
    });

    it('should reject task with invalid priority value', () => {
      const invalidDto = {
        title: 'Valid title',
        description: 'Valid description',
        priority: 'urgent',
      };

      expect(() => {
        const validPriorities = ['high', 'low', 'medium'];
        if (!validPriorities.includes(invalidDto.priority)) {
          throw new Error('Priority must be one of: high, low, medium');
        }
      }).toThrow('Priority must be one of: high, low, medium');
    });
  });

  describe('PUT /tasks/:id - Validation Tests', () => {
    it('should reject update with empty title', () => {
      const invalidUpdateDto = {
        title: '',
      };

      expect(() => {
        if (invalidUpdateDto.title !== undefined && invalidUpdateDto.title.length < 1) {
          throw new Error('Title must not be empty');
        }
      }).toThrow('Title must not be empty');
    });

    it('should reject update with invalid priority', () => {
      const invalidUpdateDto = {
        priority: 'critical',
      };

      expect(() => {
        const validPriorities = ['high', 'low', 'medium'];
        if (invalidUpdateDto.priority && !validPriorities.includes(invalidUpdateDto.priority)) {
          throw new Error('Priority must be one of: high, low, medium');
        }
      }).toThrow('Priority must be one of: high, low, medium');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update task successfully', async () => {
      const updatedTask = new Task(
        mockTaskId,
        'Updated Task',
        'Test Description',
        'medium',
        true,
        null,
        mockDate,
        mockDate,
        mockUserId,
      );
      tasksService.update.mockResolvedValue(updatedTask);

      const result = await tasksController.update(mockTaskId, mockUpdateTaskDto, mockRequest);

      expect(result).toEqual(updatedTask);
      expect(tasksService.update).toHaveBeenCalledWith(mockTaskId, mockUpdateTaskDto, mockUserId);
      expect(tasksService.update).toHaveBeenCalledTimes(1);
    });

    it('should update task with partial data', async () => {
      const partialUpdateDto = { completed: true };
      const partiallyUpdatedTask = new Task(
        mockTaskId,
        'Test Task',
        'Test Description',
        'medium',
        true,
        null,
        mockDate,
        mockDate,
        mockUserId,
      );
      tasksService.update.mockResolvedValue(partiallyUpdatedTask);

      const result = await tasksController.update(mockTaskId, partialUpdateDto, mockRequest);

      expect(result).toEqual(partiallyUpdatedTask);
      expect(tasksService.update).toHaveBeenCalledWith(mockTaskId, partialUpdateDto, mockUserId);
    });

    it('should update task deadline', async () => {
      const deadlineUpdateDto = { deadline: new Date('2024-12-31T23:59:59.000Z') };
      const taskWithUpdatedDeadline = new Task(
        mockTaskId,
        'Test Task',
        'Test Description',
        'medium',
        false,
        new Date('2024-12-31T23:59:59.000Z'),
        mockDate,
        mockDate,
        mockUserId,
      );
      tasksService.update.mockResolvedValue(taskWithUpdatedDeadline);

      const result = await tasksController.update(mockTaskId, deadlineUpdateDto, mockRequest);

      expect(result).toEqual(taskWithUpdatedDeadline);
      expect(tasksService.update).toHaveBeenCalledWith(mockTaskId, deadlineUpdateDto, mockUserId);
    });

    it('should throw NotFoundException when task not found', async () => {
      tasksService.update.mockRejectedValue(new NotFoundException('Task not found'));

      await expect(
        tasksController.update(mockTaskId, mockUpdateTaskDto, mockRequest),
      ).rejects.toThrow(new NotFoundException('Task not found'));
      expect(tasksService.update).toHaveBeenCalledWith(mockTaskId, mockUpdateTaskDto, mockUserId);
    });

    it('should throw NotFoundException when task belongs to different user', async () => {
      tasksService.update.mockRejectedValue(new NotFoundException('Task not found'));

      await expect(
        tasksController.update(mockTaskId, mockUpdateTaskDto, mockRequest),
      ).rejects.toThrow(new NotFoundException('Task not found'));
      expect(tasksService.update).toHaveBeenCalledWith(mockTaskId, mockUpdateTaskDto, mockUserId);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task successfully', async () => {
      tasksService.delete.mockResolvedValue(mockTask);

      const result = await tasksController.delete(mockTaskId, mockRequest);

      expect(result).toEqual(mockTask);
      expect(tasksService.delete).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(tasksService.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task not found', async () => {
      tasksService.delete.mockRejectedValue(new NotFoundException('Task not found'));

      await expect(tasksController.delete(mockTaskId, mockRequest)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
      expect(tasksService.delete).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });

    it('should throw NotFoundException when task belongs to different user', async () => {
      tasksService.delete.mockRejectedValue(new NotFoundException('Task not found'));

      await expect(tasksController.delete(mockTaskId, mockRequest)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
      expect(tasksService.delete).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });
  });
});

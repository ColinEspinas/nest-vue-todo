import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksRepository } from './repositories/tasks.repository';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Order } from './types/order.type';

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: jest.Mocked<TasksRepository>;

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
    tagIds: [],
  };

  const mockUpdateTaskDto: UpdateTaskDto = {
    title: 'Updated Task',
    completed: true,
  };

  const createMockTestingModule = async (): Promise<TestingModule> => {
    return Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TasksRepository,
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

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository = module.get(TasksRepository);

    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be properly initialized', () => {
      expect(tasksService).toBeDefined();
      expect(tasksService).toBeInstanceOf(TasksService);
    });
  });

  describe('findAllByUserId', () => {
    it('should return all tasks for a user (default order)', async () => {
      const mockTasks = [mockTask];
      tasksRepository.findAllByUserId.mockResolvedValue(mockTasks);

      const result = await tasksService.findAllByUserId(mockUserId, 10, 0, 'created_desc');

      expect(result).toEqual(mockTasks);
      expect(tasksRepository.findAllByUserId).toHaveBeenCalledWith(
        mockUserId,
        10,
        0,
        'created_desc',
        undefined,
      );
      expect(tasksRepository.findAllByUserId).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when user has no tasks', async () => {
      tasksRepository.findAllByUserId.mockResolvedValue([]);

      const result = await tasksService.findAllByUserId(mockUserId, 10, 0, 'created_desc');

      expect(result).toEqual([]);
      expect(tasksRepository.findAllByUserId).toHaveBeenCalledWith(
        mockUserId,
        10,
        0,
        'created_desc',
        undefined,
      );
    });

    it('should support different order values', async () => {
      const mockTasks = [mockTask];
      tasksRepository.findAllByUserId.mockResolvedValue(mockTasks);
      const orders: Order[] = ['created_asc', 'deadline_desc', 'priority_asc'];
      for (const order of orders) {
        await tasksService.findAllByUserId(mockUserId, 10, 0, order);
        expect(tasksRepository.findAllByUserId).toHaveBeenCalledWith(
          mockUserId,
          10,
          0,
          order,
          undefined,
        );
      }
    });
  });

  describe('findAllByUserId with pagination', () => {
    it('should pass limit, offset, and order to repository', async () => {
      const mockTasks = [mockTask];
      const limit = 5;
      const offset = 10;
      const order = 'priority_desc';
      tasksRepository.findAllByUserId.mockResolvedValue(mockTasks);

      const result = await tasksService.findAllByUserId(mockUserId, limit, offset, order);

      expect(result).toEqual(mockTasks);
      expect(tasksRepository.findAllByUserId).toHaveBeenCalledWith(
        mockUserId,
        limit,
        offset,
        order,
        undefined,
      );
      expect(tasksRepository.findAllByUserId).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return task when found', async () => {
      tasksRepository.findById.mockResolvedValue(mockTask);

      const result = await tasksService.findById(mockTaskId, mockUserId);

      expect(result).toEqual(mockTask);
      expect(tasksRepository.findById).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(tasksRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task not found', async () => {
      tasksRepository.findById.mockResolvedValue(null);

      await expect(tasksService.findById(mockTaskId, mockUserId)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
      expect(tasksRepository.findById).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });
  });

  describe('create', () => {
    it('should successfully create a new task', async () => {
      const expectedTask = new Task(
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
      tasksRepository.create.mockResolvedValue(expectedTask);

      const result = await tasksService.create(mockCreateTaskDto, mockUserId);

      expect(result).toEqual(expectedTask);
      expect(tasksRepository.create).toHaveBeenCalledWith(mockCreateTaskDto, mockUserId);
      expect(tasksRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should successfully update a task', async () => {
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
      tasksRepository.update.mockResolvedValue(updatedTask);

      const result = await tasksService.update(mockTaskId, mockUpdateTaskDto, mockUserId);

      expect(result).toEqual(updatedTask);
      expect(tasksRepository.update).toHaveBeenCalledWith(
        mockTaskId,
        mockUpdateTaskDto,
        mockUserId,
      );
      expect(tasksRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task not found', async () => {
      tasksRepository.update.mockResolvedValue(null);

      await expect(tasksService.update(mockTaskId, mockUpdateTaskDto, mockUserId)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
      expect(tasksRepository.update).toHaveBeenCalledWith(
        mockTaskId,
        mockUpdateTaskDto,
        mockUserId,
      );
    });
  });

  describe('delete', () => {
    it('should successfully delete a task', async () => {
      tasksRepository.delete.mockResolvedValue(mockTask);

      const result = await tasksService.delete(mockTaskId, mockUserId);

      expect(result).toEqual(mockTask);
      expect(tasksRepository.delete).toHaveBeenCalledWith(mockTaskId, mockUserId);
      expect(tasksRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when task not found', async () => {
      tasksRepository.delete.mockResolvedValue(null);

      await expect(tasksService.delete(mockTaskId, mockUserId)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
      expect(tasksRepository.delete).toHaveBeenCalledWith(mockTaskId, mockUserId);
    });
  });
});

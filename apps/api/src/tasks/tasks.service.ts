import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './repositories/tasks.repository';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { Order } from './types/order.type';

@Injectable()
export class TasksService {
  constructor(private readonly tasksRepository: TasksRepository) {}

  async findAllByUserId(
    userId: string,
    limit?: number,
    offset?: number,
    order?: Order,
  ): Promise<Task[]> {
    return await this.tasksRepository.findAllByUserId(userId, limit, offset, order);
  }

  async findById(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findById(id, userId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    return await this.tasksRepository.create(createTaskDto, userId);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.tasksRepository.update(id, updateTaskDto, userId);
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async delete(id: string, userId: string): Promise<Task> {
    const deletedTask = await this.tasksRepository.delete(id, userId);
    if (!deletedTask) {
      throw new NotFoundException('Task not found');
    }
    return deletedTask;
  }
}

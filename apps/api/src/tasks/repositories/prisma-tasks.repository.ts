import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TasksRepository } from './tasks.repository';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAllByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return tasks as Task[];
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
    });
    return task as Task | null;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = await this.prisma.task.create({
      data: {
        ...createTaskDto,
        deadline: createTaskDto.deadline || null,
        userId,
      },
    });
    return task as Task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task | null> {
    try {
      const data = Object.fromEntries(
        Object.entries(updateTaskDto).filter(([, value]) => value !== undefined),
      );

      const task = await this.prisma.task.update({
        where: { id, userId },
        data,
      });
      return task as Task;
    } catch {
      return null;
    }
  }

  async delete(id: string, userId: string): Promise<Task | null> {
    try {
      const task = await this.prisma.task.delete({
        where: { id, userId },
      });
      return task as Task;
    } catch {
      return null;
    }
  }
}

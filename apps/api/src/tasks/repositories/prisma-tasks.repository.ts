import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { TasksRepository } from './tasks.repository';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { orderToPrisma } from '../utils/order-to-prisma';
import { Order } from '../types/order.type';

@Injectable()
export class PrismaTasksRepository extends TasksRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findAllByUserId(
    userId: string,
    limit?: number,
    offset?: number,
    order?: Order,
    tagId?: string,
  ): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: {
        userId,
        ...(tagId && {
          tags: {
            some: {
              id: tagId,
            },
          },
        }),
      },
      orderBy: orderToPrisma(order),
      take: limit,
      skip: offset,
      include: { tags: true },
    });
    return tasks as Task[];
  }

  async findById(id: string, userId: string): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      where: { id, userId },
      include: { tags: true },
    });
    return task as Task | null;
  }

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const { tagIds, ...taskData } = createTaskDto;
    const task = await this.prisma.task.create({
      data: {
        ...taskData,
        deadline: taskData.deadline || null,
        userId,
        tags: tagIds
          ? {
              connect: tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { tags: true },
    });
    return task as Task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task | null> {
    try {
      const { tagIds, ...otherData } = updateTaskDto;
      const data = Object.fromEntries(
        Object.entries(otherData).filter(([, value]) => value !== undefined),
      );

      const task = await this.prisma.task.update({
        where: { id, userId },
        data: {
          ...data,
          ...(tagIds !== undefined && {
            tags: {
              set: tagIds.map((id) => ({ id })),
            },
          }),
        },
        include: { tags: true },
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
        include: { tags: true },
      });
      return task as Task;
    } catch {
      return null;
    }
  }
}

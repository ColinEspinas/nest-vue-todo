import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';
import { Order } from '../types/order.type';

export abstract class TasksRepository {
  abstract findAllByUserId(
    userId: string,
    limit?: number,
    offset?: number,
    order?: Order,
    tagId?: string,
  ): Promise<Task[]>;
  abstract findById(id: string, userId: string): Promise<Task | null>;
  abstract create(createTaskDto: CreateTaskDto, userId: string): Promise<Task>;
  abstract update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task | null>;
  abstract delete(id: string, userId: string): Promise<Task | null>;
}

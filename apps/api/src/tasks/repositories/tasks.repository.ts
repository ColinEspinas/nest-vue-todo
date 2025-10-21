import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dtos/create-task.dto';
import { UpdateTaskDto } from '../dtos/update-task.dto';

export abstract class TasksRepository {
  abstract findAllByUserId(userId: string, limit?: number, offset?: number): Promise<Task[]>;
  abstract findById(id: string, userId: string): Promise<Task | null>;
  abstract create(createTaskDto: CreateTaskDto, userId: string): Promise<Task>;
  abstract update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task | null>;
  abstract delete(id: string, userId: string): Promise<Task | null>;
}

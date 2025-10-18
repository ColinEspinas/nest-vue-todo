import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoRepository } from './todo.repository';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private todoRepository: TodoRepository) {}

  async findAll(userId: string) {
    return this.todoRepository.findAllByUser(userId);
  }

  async findOne(id: string, userId: string) {
    const todo = await this.todoRepository.findById(id, userId);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }

  async create(userId: string, createTodoDto: CreateTodoDto) {
    return this.todoRepository.create(userId, createTodoDto);
  }

  async update(id: string, userId: string, updateTodoDto: UpdateTodoDto) {
    await this.findOne(id, userId);
    return this.todoRepository.update(id, userId, updateTodoDto);
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.todoRepository.delete(id);
  }
}

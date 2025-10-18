import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Todo } from '@prisma/client';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoRepository {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string): Promise<Todo[]> {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string): Promise<Todo | null> {
    return this.prisma.todo.findFirst({
      where: { id, userId },
    });
  }

  async create(userId: string, data: CreateTodoDto): Promise<Todo> {
    return this.prisma.todo.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(id: string, userId: string, data: UpdateTodoDto): Promise<Todo> {
    return this.prisma.todo.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Todo> {
    return this.prisma.todo.delete({
      where: { id },
    });
  }
}

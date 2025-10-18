import api from './axios';
import type { Todo, CreateTodoDto, UpdateTodoDto } from '../types';

export const todosApi = {
  async getAll(): Promise<Todo[]> {
    const response = await api.get<Todo[]>('/todos');
    return response.data;
  },

  async getOne(id: string): Promise<Todo> {
    const response = await api.get<Todo>(`/todos/${id}`);
    return response.data;
  },

  async create(data: CreateTodoDto): Promise<Todo> {
    const response = await api.post<Todo>('/todos', data);
    return response.data;
  },

  async update(id: string, data: UpdateTodoDto): Promise<Todo> {
    const response = await api.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/todos/${id}`);
  },
};

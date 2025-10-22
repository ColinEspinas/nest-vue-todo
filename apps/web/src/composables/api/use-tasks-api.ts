import type { Task, CreateTask, UpdateTask, Order } from '@/types/task';
import { useApi } from './use-api';

export const useTasksApi = () => {
  const getTasks = async (options?: { limit?: number; offset?: number; order?: Order }) => {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) params.append('limit', String(options.limit));
    if (options?.offset !== undefined) params.append('offset', String(options.offset));
    if (options?.order !== undefined) params.append('order', options.order);
    const url = params.toString() ? `/tasks?${params}` : '/tasks';
    return useApi(url).json<Task[]>();
  };

  const getTask = async (id: string) => {
    return useApi(`/tasks/${id}`).json<Task>();
  };

  const createTask = async (task: CreateTask) => {
    return useApi('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }).json<Task>();
  };

  const updateTask = async (id: string, updates: UpdateTask) => {
    return useApi(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }).json<Task>();
  };

  const deleteTask = async (id: string) => {
    return useApi(`/tasks/${id}`, {
      method: 'DELETE',
    }).json<Task>();
  };

  return {
    getTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
  };
};

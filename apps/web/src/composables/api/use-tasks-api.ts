import type { Task, CreateTask, UpdateTask, Order } from '@/types/task';
import { useApi } from './use-api';

export const useTasksApi = () => {
  const parseTaskDates = (task: Task): Task => ({
    ...task,
    createdAt: new Date(task.createdAt),
    updatedAt: new Date(task.updatedAt),
    deadline: task.deadline && new Date(task.deadline),
  });

  const getTasks = async (options?: { limit?: number; offset?: number; order?: Order }) => {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) params.append('limit', String(options.limit));
    if (options?.offset !== undefined) params.append('offset', String(options.offset));
    if (options?.order !== undefined) params.append('order', options.order);
    const url = params.toString() ? `/tasks?${params}` : '/tasks';
    const response = await useApi(url).json<Task[]>();
    response.data.value = response.data.value?.map(parseTaskDates) || [];
    return response;
  };

  const getTask = async (id: string) => {
    const response = await useApi(`/tasks/${id}`).json<Task>();
    response.data.value = response.data.value ? parseTaskDates(response.data.value) : null;
    return response;
  };

  const createTask = async (task: CreateTask) => {
    return useApi('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }).json<Task>();
  };

  const updateTask = async (id: string, updates: UpdateTask) => {
    const response = await useApi(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }).json<Task>();
    response.data.value = response.data.value ? parseTaskDates(response.data.value) : null;
    return response;
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

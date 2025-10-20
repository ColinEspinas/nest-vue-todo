import type { Task, CreateTask, UpdateTask } from '@/types/task';
import { useApi } from './use-api';

export const useTasksApi = () => {
  const getAllTasks = async () => {
    return useApi('/tasks').json<Task[]>();
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
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
  };
};

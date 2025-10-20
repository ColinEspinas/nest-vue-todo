import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useTasksApi } from '@/composables/api/use-tasks-api';
import type { Task, CreateTask, UpdateTask } from '@/types/task';

export const useTasksStore = defineStore('tasks', () => {
  const api = useTasksApi();

  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const loadingTasks = ref(new Set<string>());

  const completedTasks = computed(() => tasks.value.filter((task) => task.completed));
  const pendingTasks = computed(() => tasks.value.filter((task) => !task.completed));
  const tasksByPriority = computed(() => ({
    high: tasks.value.filter((task) => task.priority === 'high'),
    medium: tasks.value.filter((task) => task.priority === 'medium'),
    low: tasks.value.filter((task) => task.priority === 'low'),
  }));

  const findTaskById = (id: string): Task | undefined => tasks.value.find((task) => task.id === id);
  const isTaskLoading = (id: string): boolean => loadingTasks.value.has(id);

  const setTaskLoading = (id: string, loading: boolean) => {
    if (loading) {
      loadingTasks.value.add(id);
    } else {
      loadingTasks.value.delete(id);
    }
  };

  const replaceTask = (updatedTask: Task) => {
    const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  };

  const fetchTasks = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: apiError } = await api.getAllTasks();
      if (apiError.value) throw new Error(apiError.value.message || 'Failed to fetch tasks');
      tasks.value = data.value || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getTask = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: apiError } = await api.getTask(id);
      if (apiError.value) throw new Error(apiError.value.message || 'Task not found');
      return data.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch task';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createTask = async (task: CreateTask) => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: apiError } = await api.createTask(task);
      if (apiError.value) throw new Error(apiError.value.message || 'Failed to create task');
      if (data.value) {
        tasks.value.unshift(data.value);
        return data.value;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create task';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (id: string, task: UpdateTask) => {
    error.value = null;
    try {
      const { data, error: apiError } = await api.updateTask(id, task);
      if (apiError.value) throw new Error(apiError.value.message || 'Failed to update task');
      if (data.value) {
        replaceTask(data.value);
        return data.value;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task';
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    setTaskLoading(id, true);
    error.value = null;

    try {
      const { data, error: apiError } = await api.deleteTask(id);
      if (apiError.value) throw new Error(apiError.value.message || 'Failed to delete task');
      tasks.value = tasks.value.filter((task) => task.id !== id);
      return data.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete task';
      throw err;
    } finally {
      setTaskLoading(id, false);
    }
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = findTaskById(id);
    if (!task) return;

    setTaskLoading(id, true);

    const originalCompleted = task.completed;
    task.completed = !task.completed;

    try {
      const { data, error: apiError } = await api.updateTask(id, { completed: task.completed });
      if (apiError.value) {
        task.completed = originalCompleted;
        throw new Error(apiError.value.message || 'Failed to update task');
      }
      if (data.value) {
        replaceTask(data.value);
      }
      return data.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update task';
      throw err;
    } finally {
      setTaskLoading(id, false);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const clearTasks = () => {
    tasks.value = [];
    loadingTasks.value.clear();
  };

  return {
    tasks,
    loading,
    error,
    completedTasks,
    pendingTasks,
    tasksByPriority,
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    findTaskById,
    isTaskLoading,
    clearError,
    clearTasks,
  };
});

import { defineStore, storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useTasksApi } from '@/composables/api/use-tasks-api';
import type { Task, CreateTask, UpdateTask, Order } from '@/types/task';
import { useAuthStore } from './auth';

export const useTasksStore = defineStore('tasks', () => {
  const api = useTasksApi();
  const authStore = useAuthStore();
  const { totalTasksStat, completedTasksStat } = storeToRefs(authStore);

  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const creating = ref(false);
  const error = ref<string | null>(null);

  const tasksByPriority = computed(() => ({
    high: tasks.value.filter((task) => task.priority === 'high'),
    medium: tasks.value.filter((task) => task.priority === 'medium'),
    low: tasks.value.filter((task) => task.priority === 'low'),
  }));

  const findTaskById = (id: string): Task | undefined => tasks.value.find((task) => task.id === id);

  const replaceTask = (updatedTask: Task) => {
    const index = tasks.value.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask;
    }
  };

  const fetchTasks = async (options?: { limit?: number; offset?: number; order?: Order }) => {
    loading.value = true;
    error.value = null;

    const { data, error: apiError } = await api.getTasks(options);
    if (apiError.value) {
      error.value = 'Échec du chargement des tâches';
      loading.value = false;
      return;
    }

    tasks.value = data.value || [];
    loading.value = false;
  };

  const getTask = async (id: string) => {
    loading.value = true;
    error.value = null;

    const { data, error: apiError } = await api.getTask(id);
    if (apiError.value) {
      error.value = 'Tâche introuvable';
      loading.value = false;
      return;
    }

    loading.value = false;
    return data.value;
  };

  const createTask = async (task: CreateTask) => {
    error.value = null;
    creating.value = true;

    const { data, error: apiError } = await api.createTask(task);
    if (apiError.value) {
      error.value = 'Échec de la création de la tâche';
      creating.value = false;
      return;
    }

    if (data.value) {
      tasks.value.unshift(data.value);
    }

    totalTasksStat.value += 1;
    creating.value = false;
    return data.value;
  };

  const updateTask = async (id: string, task: UpdateTask) => {
    error.value = null;

    const originalTask = findTaskById(id);
    replaceTask({ ...originalTask, ...task } as Task);

    const { data, error: apiError } = await api.updateTask(id, task);
    if (apiError.value) {
      error.value = 'Échec de la mise à jour de la tâche';
      if (originalTask) {
        replaceTask(originalTask);
      }
      return;
    }
    return data.value;
  };

  const deleteTask = async (id: string) => {
    error.value = null;

    const deletedTask = findTaskById(id);
    const originalIndex = tasks.value.findIndex((task) => task.id === id);
    tasks.value = tasks.value.filter((task) => task.id !== id);
    totalTasksStat.value -= 1;

    const { data, error: apiError } = await api.deleteTask(id);
    if (apiError.value) {
      error.value = 'Échec de la suppression de la tâche';
      if (deletedTask && originalIndex !== -1) {
        tasks.value.splice(originalIndex, 0, deletedTask);
        totalTasksStat.value += 1;
      }
      return;
    }

    return data.value;
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = findTaskById(id);
    if (!task) return;

    const completed = task.completed;
    task.completed = !task.completed;

    completedTasksStat.value += task.completed ? 1 : -1;

    const { data, error: apiError } = await api.updateTask(id, { completed: task.completed });
    if (apiError.value) {
      task.completed = completed;
      error.value = 'Échec de la mise à jour de la tâche';
      completedTasksStat.value += task.completed ? 1 : -1;
      return;
    }

    if (data.value) {
      replaceTask(data.value);
    }

    return data.value;
  };

  const clearError = () => {
    error.value = null;
  };

  const clearTasks = () => {
    tasks.value = [];
  };

  return {
    tasks,
    loading,
    error,
    creating,
    tasksByPriority,
    fetchTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    findTaskById,
    clearError,
    clearTasks,
  };
});

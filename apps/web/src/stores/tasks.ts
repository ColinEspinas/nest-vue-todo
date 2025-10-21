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

    const { data, error: apiError } = await api.getAllTasks();
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
    loading.value = true;
    error.value = null;

    const { data, error: apiError } = await api.createTask(task);
    if (apiError.value) {
      error.value = 'Échec de la création de la tâche';
      loading.value = false;
      return;
    }

    if (data.value) {
      tasks.value.unshift(data.value);
    }
    loading.value = false;
    return data.value;
  };

  const updateTask = async (id: string, task: UpdateTask) => {
    error.value = null;

    const { data, error: apiError } = await api.updateTask(id, task);
    if (apiError.value) {
      error.value = 'Échec de la mise à jour de la tâche';
      return;
    }

    if (data.value) {
      replaceTask(data.value);
    }
    return data.value;
  };

  const deleteTask = async (id: string) => {
    setTaskLoading(id, true);
    error.value = null;

    const { data, error: apiError } = await api.deleteTask(id);
    if (apiError.value) {
      error.value = 'Échec de la suppression de la tâche';
      setTaskLoading(id, false);
      return;
    }

    tasks.value = tasks.value.filter((task) => task.id !== id);
    setTaskLoading(id, false);
    return data.value;
  };

  const toggleTaskCompletion = async (id: string) => {
    const task = findTaskById(id);
    if (!task) return;

    setTaskLoading(id, true);
    const completed = task.completed;
    task.completed = !task.completed;

    const { data, error: apiError } = await api.updateTask(id, { completed: task.completed });
    if (apiError.value) {
      task.completed = completed;
      error.value = 'Échec de la mise à jour de la tâche';
      setTaskLoading(id, false);
      return;
    }

    if (data.value) {
      replaceTask(data.value);
    }
    setTaskLoading(id, false);
    return data.value;
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

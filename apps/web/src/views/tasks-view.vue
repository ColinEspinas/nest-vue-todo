<script setup lang="ts">
import { onMounted } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import TaskStats from '@/components/app/tasks/task-stats.vue';
import TaskList from '@/components/app/tasks/task-list.vue';
import LoadingSpinner from '@/components/app/loading-spinner.vue';
import ErrorMessage from '@/components/app/error-message.vue';
import TaskCreateForm from '@/components/app/tasks/task-create-form.vue';
import type { CreateTask } from '@/types/task';

const tasksStore = useTasksStore();

onMounted(async () => {
  try {
    await tasksStore.fetchTasks();
  } catch (error) {
    console.error('Failed to load tasks:', error);
  }
});

const handleToggleComplete = async (taskId: string) => {
  try {
    await tasksStore.toggleTaskCompletion(taskId);
  } catch (error) {
    console.error('Failed to toggle task completion:', error);
  }
};

const handleDeleteTask = async (taskId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
    try {
      await tasksStore.deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }
};

const handleSubmit = async (task: CreateTask) => {
  try {
    await tasksStore.createTask(task);
  } catch (error) {
    console.error('Failed to create task:', error);
  }
};
</script>

<template>
  <main
    class="bg-base-200 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-base-content-100/10"
  >
    <TaskCreateForm class="mb-4" @submit="handleSubmit" />

    <LoadingSpinner :loading="tasksStore.loading" />
    <ErrorMessage v-if="tasksStore.error" :error="tasksStore.error" />

    <div v-if="!tasksStore.loading && !tasksStore.error">
      <TaskStats
        class="mb-4"
        :total="tasksStore.tasks.length"
        :completed="tasksStore.completedTasks.length"
        :pending="tasksStore.pendingTasks.length"
      />

      <TaskList
        :tasks="tasksStore.tasks"
        @toggle-complete="handleToggleComplete"
        @delete="handleDeleteTask"
      />
    </div>
  </main>
</template>

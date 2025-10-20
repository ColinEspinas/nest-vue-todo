<script setup lang="ts">
import { onMounted } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import TaskStats from '@/components/app/task-stats.vue';
import TaskList from '@/components/app/task-list.vue';
import LoadingSpinner from '@/components/app/loading-spinner.vue';
import ErrorMessage from '@/components/app/error-message.vue';

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
</script>

<template>
  <main
    class="container mx-auto max-w-4xl bg-base-200 p-4 rounded-3xl border-1 border-base-content-100/10"
  >
    <div class="mb-8 mt-4">
      <h1 class="text-3xl font-bold text-base-content-100 mb-2">Mes Tâches</h1>
      <p class="text-base-content-200">Gérez vos tâches et restez organisé</p>
    </div>

    <!-- Loading State -->
    <LoadingSpinner :loading="tasksStore.loading" />

    <!-- Error State -->
    <ErrorMessage v-if="tasksStore.error" :error="tasksStore.error" />

    <!-- Tasks Content -->
    <div v-if="!tasksStore.loading && !tasksStore.error">
      <!-- Summary Stats -->
      <TaskStats
        :total="tasksStore.tasks.length"
        :completed="tasksStore.completedTasks.length"
        :pending="tasksStore.pendingTasks.length"
      />

      <!-- Task List -->
      <TaskList
        :tasks="tasksStore.tasks"
        @toggle-complete="handleToggleComplete"
        @delete="handleDeleteTask"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import TaskStats from '@/components/app/tasks/task-stats.vue';
import TaskList from '@/components/app/tasks/task-list.vue';
import TaskStatsSkeleton from '@/components/app/skeletons/task-stats-skeleton.vue';
import TaskListSkeleton from '@/components/app/skeletons/task-list-skeleton.vue';
import ErrorMessage from '@/components/app/error-message.vue';
import TaskCreateForm from '@/components/app/tasks/task-create-form.vue';
import type { CreateTask } from '@/types/task';
import { storeToRefs } from 'pinia';

const tasksStore = useTasksStore();
const { tasks, loading, error } = storeToRefs(tasksStore);

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
  <main>
    <section
      class="mb-4 bg-base-200/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-base-content-100/10"
    >
      <TaskCreateForm @submit="handleSubmit" />
    </section>

    <ErrorMessage v-if="error" :error="error" />

    <div
      class="bg-base-200/50 p-3 sm:p-4 rounded-2xl sm:rounded-3xl border-2 border-base-content-100/10"
    >
      <section class="mb-4">
        <TaskStatsSkeleton v-if="loading" />
        <TaskStats
          v-else
          :total="tasks.length"
          :completed="tasksStore.completedTasks.length"
          :pending="tasksStore.pendingTasks.length"
        />
      </section>

      <section>
        <TaskListSkeleton v-if="loading" />
        <TaskList
          v-else
          :tasks="tasksStore.tasks"
          @toggle-complete="handleToggleComplete"
          @delete="handleDeleteTask"
        />
      </section>
    </div>
  </main>
</template>

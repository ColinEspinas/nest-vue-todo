<script setup lang="ts">
import { onMounted, ref, watch, computed } from 'vue';
import { useTasksStore } from '@/stores/tasks';
import TaskStats from '@/components/app/tasks/task-stats.vue';
import TaskList from '@/components/app/tasks/task-list.vue';
import TaskStatsSkeleton from '@/components/app/skeletons/task-stats-skeleton.vue';
import TaskListSkeleton from '@/components/app/skeletons/task-list-skeleton.vue';
import ErrorMessage from '@/components/app/error-message.vue';
import TaskCreateForm from '@/components/app/tasks/task-create-form.vue';
import TaskDeleteDialog from '@/components/app/dialogs/task-delete-dialog.vue';
import type { CreateTask } from '@/types/task';
import { storeToRefs } from 'pinia';
import { useTimeoutFn } from '@vueuse/core';

const tasksStore = useTasksStore();
const { tasks, loading, error, creating } = storeToRefs(tasksStore);

const delayedLoading = ref(false);
const { start, stop } = useTimeoutFn(
  () => {
    delayedLoading.value = true;
  },
  400,
  { immediate: false },
);

watch(creating, (val) => {
  if (val) {
    start();
  } else {
    stop();
    delayedLoading.value = false;
  }
});

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

const handleDeleteTask = (taskId: string) => {
  showDeleteDialog.value = true;
  taskToDeleteId.value = taskId;
};

const confirmDeleteTask = async () => {
  if (taskToDeleteId.value) {
    try {
      await tasksStore.deleteTask(taskToDeleteId.value);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }
  showDeleteDialog.value = false;
  taskToDeleteId.value = null;
};

const closeDeleteDialog = () => {
  showDeleteDialog.value = false;
  taskToDeleteId.value = null;
};

const showDeleteDialog = ref(false);
const taskToDeleteId = ref<string | null>(null);

const taskToDelete = computed(() =>
  taskToDeleteId.value ? tasksStore.findTaskById(taskToDeleteId.value) : undefined,
);

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
    <section class="mb-4 bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <TaskCreateForm @submit="handleSubmit" :loading="delayedLoading" />
    </section>

    <ErrorMessage v-if="error" :error="error" />

    <div class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
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

    <TaskDeleteDialog
      :open="showDeleteDialog"
      :task="taskToDelete"
      @close="closeDeleteDialog"
      @confirm="confirmDeleteTask"
    />
  </main>
</template>

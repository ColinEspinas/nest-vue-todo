<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTimeoutFn } from '@vueuse/core';
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';
import type { CreateTask } from '@/types/task';
import ErrorMessage from '@/components/app/error-message.vue';
import TaskCreateForm from '@/components/app/tasks/task-create-form.vue';
import TaskDeleteDialog from '@/components/app/dialogs/task-delete-dialog.vue';
import TaskList from '@/components/app/tasks/task-list.vue';
import TaskListSkeleton from '@/components/app/skeletons/task-list-skeleton.vue';
import TaskStats from '@/components/app/tasks/task-stats.vue';
import TaskStatsSkeleton from '@/components/app/skeletons/task-stats-skeleton.vue';
import UiPagination from '@/components/ui/ui-pagination.vue';

const authStore = useAuthStore();
const {
  totalTasksStat,
  completedTasksStat,
  pendingTasksStat,
  loading: loadingUser,
} = storeToRefs(authStore);

const tasksStore = useTasksStore();
const { tasks, loading: loadingTasks, error, creating } = storeToRefs(tasksStore);

const delayedCreationLoading = ref(false);
const { start, stop } = useTimeoutFn(
  () => {
    delayedCreationLoading.value = true;
  },
  400,
  { immediate: false },
);

watch(creating, (val) => {
  if (val) {
    start();
  } else {
    stop();
    delayedCreationLoading.value = false;
  }
});

const route = useRoute();
const router = useRouter();

const limit = ref(10);
const page = ref(Number(route.query.page) || 1);

const offset = computed(() => (page.value - 1) * limit.value);

const fetchPage = async () => {
  await tasksStore.fetchTasks({ limit: limit.value, offset: offset.value });
};

watch([page, limit], () => {
  fetchPage();
  router.replace({ query: { ...route.query, page: page.value } });
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

onMounted(fetchPage);
</script>

<template>
  <main>
    <section class="mb-4 bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <TaskCreateForm @submit="handleSubmit" :loading="delayedCreationLoading" />
    </section>

    <ErrorMessage v-if="error" :error="error" />

    <div class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <section class="mb-4">
        <TaskStatsSkeleton v-if="loadingUser" />

        <TaskStats
          v-else
          :total="totalTasksStat"
          :completed="completedTasksStat"
          :pending="pendingTasksStat"
        />
      </section>

      <section class="flex justify-end mb-4">
        <UiPagination v-model:page="page" :limit="limit" :total="totalTasksStat" class=" " />
      </section>

      <section>
        <TaskListSkeleton v-if="loadingTasks" />
        <TaskList
          v-else
          :tasks
          @toggle-complete="handleToggleComplete"
          @delete="handleDeleteTask"
        />
      </section>

      <UiPagination
        v-model:page="page"
        :limit="limit"
        :total="totalTasksStat"
        class="mt-4 flex justify-center"
      />
    </div>

    <TaskDeleteDialog
      :open="showDeleteDialog"
      :task="taskToDelete"
      @close="closeDeleteDialog"
      @confirm="confirmDeleteTask"
    />
  </main>
</template>

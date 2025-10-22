<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTimeoutFn } from '@vueuse/core';
import { useAuthStore } from '@/stores/auth';
import { useTasksStore } from '@/stores/tasks';
import { orderValues, type CreateTask, type Order } from '@/types/task';
import ErrorMessage from '@/components/app/error-message.vue';
import TaskCreateForm from '@/components/app/forms/task-create-form.vue';
import TaskDeleteDialog from '@/components/app/dialogs/task-delete-dialog.vue';
import TaskList from '@/components/app/tasks/task-list.vue';
import TaskListSkeleton from '@/components/app/skeletons/task-list-skeleton.vue';
import TaskStats from '@/components/app/tasks/task-stats.vue';
import TaskStatsSkeleton from '@/components/app/skeletons/task-stats-skeleton.vue';
import UiPagination from '@/components/ui/ui-pagination.vue';
import OrderSelect from '@/components/app/inputs/order-select.vue';

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
const maxPage = computed(() =>
  Math.max(1, Math.ceil((Number(totalTasksStat.value) || 0) / limit.value)),
);

const queryOrder = route.query.order as Order | undefined;
const initialOrder = queryOrder && orderValues.includes(queryOrder) ? queryOrder : orderValues[0];
const order = ref<Order>(initialOrder);

const fetchPage = async () => {
  await tasksStore.fetchTasks({ limit: limit.value, offset: offset.value, order: order.value });
};

watch([page, limit, totalTasksStat, order], () => {
  if (page.value < 1) page.value = 1;
  else if (page.value > maxPage.value) page.value = maxPage.value;
  fetchPage();
  router.replace({ query: { ...route.query, page: page.value, order: order.value } });
});

onMounted(async () => {
  if (page.value < 1) page.value = 1;
  else if (page.value > maxPage.value) page.value = maxPage.value;
  try {
    await fetchPage();
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

      <section v-if="totalTasksStat > 0" class="flex justify-between mb-4">
        <OrderSelect v-model="order" class="mr-4" @update:model-value="fetchPage" />
        <UiPagination v-model:page="page" :limit="limit" :total="totalTasksStat" class=" " />
      </section>

      <section>
        <TaskListSkeleton
          v-if="loadingTasks && tasks.length === 0 && !loadingUser && totalTasksStat !== 0"
        />
        <TaskList
          v-else
          :tasks
          @toggle-complete="handleToggleComplete"
          @delete="handleDeleteTask"
        />
      </section>

      <UiPagination
        v-if="maxPage > 1"
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

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTasksStore } from '@/stores/tasks';
import { useTagsStore } from '@/stores/tags';
import { orderValues, type Order, type UpdateTask } from '@/types/task';
import ErrorMessage from '@/components/app/common/error-message.vue';
import TaskDeleteDialog from '@/components/app/dialogs/task-delete-dialog.vue';
import TaskList from '@/components/app/tasks/task-list.vue';
import TaskListSkeleton from '@/components/app/skeletons/task-list-skeleton.vue';
import TaskStats from '@/components/app/tasks/task-stats.vue';
import UiPagination from '@/components/ui/ui-pagination.vue';
import OrderSelect from '@/components/app/inputs/order-select.vue';
import TaskEditDialog from '@/components/app/dialogs/task-edit-dialog.vue';
import TagDeleteDialog from '@/components/app/dialogs/tag-delete-dialog.vue';
import TagHeader from '@/components/app/tag-edit-header.vue';

const route = useRoute();
const router = useRouter();

const tasksStore = useTasksStore();
const { tasks, loading, error } = storeToRefs(tasksStore);

const tagsStore = useTagsStore();

const tagId = computed(() => route.params.tagId as string);
const tag = computed(() => tagsStore.findTagById(tagId.value));

const limit = ref(10);
const page = ref(Number(route.query.page) || 1);
const offset = computed(() => (page.value - 1) * limit.value);

const queryOrder = route.query.order as Order | undefined;
const initialOrder = queryOrder && orderValues.includes(queryOrder) ? queryOrder : orderValues[0];
const order = ref<Order>(initialOrder);

// Use stats for tasks with this tag
const totalTasks = computed(() => tasks.value.length);
const completedTasks = computed(() => tasks.value.filter((task) => task.completed).length);
const pendingTasks = computed(() => totalTasks.value - completedTasks.value);

const maxPage = computed(() => Math.max(1, Math.ceil(totalTasks.value / limit.value)));

const fetchTasks = async () => {
  await tasksStore.fetchTasks({
    limit: limit.value,
    offset: offset.value,
    order: order.value,
    tagId: tagId.value,
  });
};

watch([page, limit, order], () => {
  if (page.value < 1) page.value = 1;
  else if (page.value > maxPage.value) page.value = maxPage.value;
  router.replace({ query: { ...route.query, page: page.value, order: order.value } });
});

watch(tagId, () => {
  page.value = 1;
  fetchTasks();
});

onMounted(async () => {
  if (page.value < 1) page.value = 1;
  else if (page.value > maxPage.value) page.value = maxPage.value;
  try {
    await Promise.all([tagsStore.fetchTags(), fetchTasks()]);
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

const handleEditTask = (taskId: string) => {
  showEditDialog.value = true;
  taskToEditId.value = taskId;
};

const confirmEditTask = async (
  updatedTask: UpdateTask,
  tagsToCreate: Array<{ name: string; color?: string }>,
) => {
  if (taskToEditId.value) {
    try {
      // Create new tags if any and add their IDs to the task
      if (tagsToCreate.length > 0) {
        const newTags = await tagsStore.createTags(tagsToCreate);
        if (!updatedTask.tagIds) {
          updatedTask.tagIds = [];
        }
        updatedTask.tagIds.push(...newTags.map((tag) => tag.id));
      }
      await tasksStore.updateTask(taskToEditId.value, updatedTask);
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  }
  showEditDialog.value = false;
  taskToEditId.value = null;
};

const showEditDialog = ref(false);
const taskToEditId = ref<string | null>(null);

const taskToEdit = computed(() => {
  return taskToEditId.value ? tasksStore.findTaskById(taskToEditId.value) : undefined;
});

const closeEditDialog = () => {
  showEditDialog.value = false;
  taskToEditId.value = null;
};

// Tag controls
const showTagDeleteDialog = ref(false);

const updateTagName = async (name: string) => {
  if (tag.value) {
    try {
      await tagsStore.updateTag(tag.value.id, { name });
      await fetchTasks();
    } catch (error) {
      console.error('Failed to update tag name:', error);
    }
  }
};

const updateTagColor = async (color: string) => {
  if (tag.value) {
    try {
      await tagsStore.updateTag(tag.value.id, { color });
      await fetchTasks();
    } catch (error) {
      console.error('Failed to update tag color:', error);
    }
  }
};

const handleDeleteTag = () => {
  showTagDeleteDialog.value = true;
};

const confirmDeleteTag = async () => {
  if (tag.value) {
    try {
      await tagsStore.deleteTag(tag.value.id);
      showTagDeleteDialog.value = false;
      router.push('/');
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  }
};

const closeTagDeleteDialog = () => {
  showTagDeleteDialog.value = false;
};
</script>

<template>
  <div>
    <ErrorMessage v-if="error" :error="error" />

    <div v-if="tag" class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <!-- Tag Header -->
      <section class="mb-4">
        <TagHeader
          :tag="tag"
          @update-name="updateTagName"
          @update-color="updateTagColor"
          @delete="handleDeleteTag"
        />
      </section>

      <section class="mb-4">
        <TaskStats :total="totalTasks" :completed="completedTasks" :pending="pendingTasks" />
      </section>

      <section v-if="totalTasks > 0" class="flex flex-col sm:flex-row gap-4 justify-between mb-4">
        <OrderSelect v-model="order" @update:model-value="fetchTasks" />
        <UiPagination v-model:page="page" :limit="limit" :total="totalTasks" />
      </section>

      <section>
        <TaskListSkeleton v-if="loading && tasks.length === 0" />
        <TaskList
          v-else
          :tasks="tasks"
          @toggle-complete="handleToggleComplete"
          @delete="handleDeleteTask"
          @edit="handleEditTask"
        />
      </section>

      <UiPagination
        v-if="maxPage > 1"
        v-model:page="page"
        :limit="limit"
        :total="totalTasks"
        class="mt-4 flex justify-center"
      />
    </div>

    <TaskDeleteDialog
      :open="showDeleteDialog"
      :task="taskToDelete"
      @close="closeDeleteDialog"
      @confirm="confirmDeleteTask"
    />

    <TaskEditDialog
      v-if="taskToEdit"
      :open="showEditDialog"
      :task="taskToEdit"
      @close="closeEditDialog"
      @confirm="confirmEditTask"
    />

    <TagDeleteDialog
      :open="showTagDeleteDialog"
      :tag="tag"
      @close="closeTagDeleteDialog"
      @confirm="confirmDeleteTag"
    />
  </div>
</template>

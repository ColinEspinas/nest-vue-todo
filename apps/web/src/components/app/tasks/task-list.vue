<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Task } from '@/types/task';
import TaskItem from './task-item.vue';
import { Icon } from '@iconify/vue';

const { t } = useI18n();

defineProps<{
  tasks: Task[];
}>();

defineEmits<{
  toggleComplete: [id: string];
  delete: [id: string];
  edit: [id: string];
}>();
</script>

<template>
  <div
    v-if="tasks.length === 0"
    class="text-center px-4 py-12 bg-base-100 rounded-2xl border-2 border-base-300"
  >
    <Icon icon="ph:eyes" class="mx-auto h-10 w-10 text-base-content-300" />
    <h3 class="mt-4 text-base font-medium text-base-content-100">{{ t('tasks.empty.title') }}</h3>
    <p class="mt-2 text-base-content-200 text-sm">{{ t('tasks.empty.description') }}</p>
  </div>

  <div v-else class="space-y-4">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task
      @toggle-complete="$emit('toggleComplete', $event)"
      @delete="$emit('delete', $event)"
      @edit="$emit('edit', $event)"
    />
  </div>
</template>

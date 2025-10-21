<script setup lang="ts">
import type { Task } from '@/types/task';
import TaskItem from './task-item.vue';
import { Icon } from '@iconify/vue';

defineProps<{
  tasks: Task[];
}>();

defineEmits<{
  toggleComplete: [id: string];
  delete: [id: string];
}>();
</script>

<template>
  <div v-if="tasks.length === 0" class="text-center py-12">
    <Icon icon="ph:clipboard" class="mx-auto h-12 w-12 text-base-content-300" />
    <h3 class="mt-4 text-lg font-medium text-base-content-100">Aucune tâche pour le moment</h3>
    <p class="mt-2 text-base-content-200">Commencez par créer votre première tâche.</p>
  </div>

  <div v-else class="space-y-4">
    <TaskItem
      v-for="task in tasks"
      :key="task.id"
      :task
      @toggle-complete="$emit('toggleComplete', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

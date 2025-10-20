<script setup lang="ts">
import type { Task } from '@/types/task';
import { Icon } from '@iconify/vue';
import UiCheckbox from '@/components/ui/ui-checkbox.vue';
import UiTag from '@/components/ui/ui-tag.vue';
import UiButton from '@/components/ui/ui-button.vue';

defineProps<{
  task: Task;
}>();

defineEmits<{
  toggleComplete: [id: string];
  delete: [id: string];
}>();

const getPriorityLabel = (priority: string) => {
  const labels: Record<string, string> = {
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse',
  };
  return labels[priority] || priority;
};

const formatDate = (date: Date | null) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>

<template>
  <div class="bg-base-100 rounded-2xl border border-base-300 p-6">
    <div class="flex items-start justify-between">
      <div class="flex items-start space-x-4 flex-1">
        <!-- Checkbox -->
        <div class="mt-1">
          <UiCheckbox :checked="task.completed" @change="$emit('toggleComplete', task.id)" />
        </div>

        <!-- Task Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center space-x-2 mb-2">
            <h3
              :class="[
                'font-medium',
                task.completed ? 'line-through text-base-content-300' : 'text-base-content-100',
              ]"
            >
              {{ task.title }}
            </h3>
            <UiTag :label="getPriorityLabel(task.priority)" :variant="task.priority" size="sm" />
          </div>

          <p
            :class="[
              'text-sm mb-3',
              task.completed ? 'text-base-content-300' : 'text-base-content-200',
            ]"
          >
            {{ task.description }}
          </p>

          <!-- Task Meta -->
          <div class="flex items-center space-x-4 text-xs text-base-content-300">
            <span>Créée le {{ formatDate(task.createdAt) }}</span>
            <span v-if="task.deadline" class="flex items-center">
              <Icon icon="ph:calendar" class="w-3 h-3 mr-1" />
              Échéance {{ formatDate(task.deadline) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2 ml-4">
        <UiButton
          variant="ghost"
          size="sm"
          shape="rounded"
          before-icon="ph:trash"
          aria-label="Supprimer la tâche"
          @click="$emit('delete', task.id)"
        />
      </div>
    </div>
  </div>
</template>

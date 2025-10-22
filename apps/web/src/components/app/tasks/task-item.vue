<script setup lang="ts">
import type { Task } from '@/types/task';
import UiCheckbox from '@/components/ui/ui-checkbox.vue';
import PriorityTag from '@/components/app/tags/priority-tag.vue';
import DeadlineTag from '@/components/app/tags/deadline-tag.vue';
import CreatedAtTag from '@/components/app/tags/created-at-tag.vue';
import UiButton from '@/components/ui/ui-button.vue';
import UpdatedAtTag from '../tags/updated-at-tag.vue';
import { computed } from 'vue';

const props = defineProps<{
  task: Task;
  hideActions?: boolean;
  disabledCheckbox?: boolean;
}>();

defineEmits<{
  toggleComplete: [id: string];
  delete: [id: string];
  edit: [id: string];
}>();

const createdUpdatedDifference = computed(() => {
  return props.task.updatedAt.getTime() - props.task.createdAt.getTime();
});
</script>

<template>
  <article class="group flex flex-col gap-2 rounded-2xl border-2 border-base-300 p-4 bg-base-100">
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <UiCheckbox
          :checked="task.completed"
          :disabled="disabledCheckbox"
          @change="$emit('toggleComplete', task.id)"
        />
        <h3
          :class="[
            'font-semibold',
            task.completed ? 'line-through text-base-content-300' : 'text-base-content-100',
          ]"
        >
          {{ task.title }}
        </h3>
      </div>
      <div
        v-if="!hideActions"
        class="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <UiButton
          variant="ghost"
          size="sm"
          shape="rounded"
          before-icon="ph:pencil"
          aria-label="Modifier la tâche"
          @click="$emit('edit', task.id)"
        />
        <UiButton
          variant="ghost"
          size="sm"
          shape="rounded"
          before-icon="ph:trash"
          aria-label="Supprimer la tâche"
          @click="$emit('delete', task.id)"
        />
      </div>
    </header>
    <p
      :class="['text-sm mb-3', task.completed ? 'text-base-content-300' : 'text-base-content-200']"
    >
      {{ task.description }}
    </p>
    <footer class="flex items-center flex-wrap gap-2 text-xs text-base-content-300">
      <CreatedAtTag :created-at="task.createdAt" />
      <UpdatedAtTag v-if="createdUpdatedDifference !== 0" :updated-at="task.updatedAt" />
      <DeadlineTag v-if="task.deadline" :deadline="task.deadline" />
      <PriorityTag :priority="task.priority" />
    </footer>
  </article>
</template>

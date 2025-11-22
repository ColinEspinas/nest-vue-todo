<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Task } from '@/types/task';
import UiCheckbox from '@/components/ui/ui-checkbox.vue';
import PriorityChip from '@/components/app/chips/priority-chip.vue';
import DeadlineChip from '@/components/app/chips/deadline-chip.vue';
import CreatedAtChip from '@/components/app/chips/created-at-chip.vue';
import UpdatedAtChip from '@/components/app/chips/updated-at-chip.vue';
import TagChip from '@/components/app/chips/tag-chip.vue';
import UiButton from '@/components/ui/ui-button.vue';
import { computed } from 'vue';

const { t } = useI18n();

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
            'font-semibold max-w-96 text-ellipsis line-clamp-1',
            task.completed ? 'line-through text-base-content-300' : 'text-base-content-100',
          ]"
          :title="task.title"
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
          :aria-label="t('tasks.actions.edit')"
          @click="$emit('edit', task.id)"
        />
        <UiButton
          variant="ghost"
          size="sm"
          shape="rounded"
          before-icon="ph:trash"
          :aria-label="t('tasks.actions.delete')"
          @click="$emit('delete', task.id)"
        />
      </div>
    </header>
    <div v-if="task.tags.length" class="flex flex-wrap gap-1.5">
      <TagChip v-for="tag in task.tags" :key="tag.id" :tag="tag" />
    </div>
    <p
      :class="[
        'text-sm mb-3 line-clamp-6 text-ellipsis',
        task.completed ? 'text-base-content-300' : 'text-base-content-200',
      ]"
      :title="task.description"
    >
      {{ task.description }}
    </p>
    <footer class="flex items-center flex-wrap gap-2 text-xs text-base-content-300">
      <CreatedAtChip :created-at="task.createdAt" />
      <UpdatedAtChip v-if="createdUpdatedDifference !== 0" :updated-at="task.updatedAt" />
      <DeadlineChip v-if="task.deadline" :deadline="task.deadline" :is-completed="task.completed" />
      <PriorityChip :priority="task.priority" />
    </footer>
  </article>
</template>

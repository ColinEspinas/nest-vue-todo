<script setup lang="ts">
import {
  DialogRoot,
  DialogContent,
  DialogClose,
  VisuallyHidden,
  DialogTitle,
  DialogDescription,
} from 'reka-ui';
import UiButton from '@/components/ui/ui-button.vue';
import TaskItem from '@/components/app/tasks/task-item.vue';
import type { Task } from '@/types/task';
import { Icon } from '@iconify/vue';

defineProps<{ open: boolean; task?: Task }>();
defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <DialogRoot :open="open" @update:open="(val) => !val && $emit('close')">
    <DialogContent
      class="fixed inset-0 z-50 flex items-center justify-center bg-base-content-100/30"
    >
      <div class="max-w-xl px-4">
        <div
          class="bg-base-100 rounded-2xl shadow-lg border-2 border-base-300 p-4 flex flex-col items-center"
        >
          <VisuallyHidden asChild>
            <DialogTitle>Supprimer cette tâche ?</DialogTitle>
          </VisuallyHidden>
          <div v-if="task" class="mb-4 w-full p-2 border-2 border-base-300 rounded-3xl bg-base-200">
            <TaskItem :task="task" :hide-actions="true" :disabled-checkbox="true" />
          </div>
          <div class="flex flex-col sm:flex-row gap-6 w-full justify-between items-center">
            <div class="flex items-center gap-2">
              <Icon icon="ph:warning-circle" class="w-6 h-6 text-error flex-shrink-0" />
              <DialogDescription class="text-base-content-200 text-sm">
                Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible.
              </DialogDescription>
            </div>
            <div class="flex gap-3">
              <DialogClose as="button">
                <UiButton text="Annuler" variant="accent" />
              </DialogClose>
              <UiButton text="Supprimer" variant="ghost" @click="$emit('confirm')" />
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </DialogRoot>
</template>

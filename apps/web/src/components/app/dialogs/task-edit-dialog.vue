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
import type { Task, UpdateTask } from '@/types/task';
import TaskEditForm from '../forms/task-edit-form.vue';
import { Icon } from '@iconify/vue';
import { ref, useTemplateRef, watch } from 'vue';

const props = defineProps<{ open: boolean; task: Task }>();
const emit = defineEmits<{ close: []; confirm: [task: UpdateTask] }>();

const editForm = useTemplateRef('editForm');

const updatedTask = ref<UpdateTask>({
  title: props.task.title,
  description: props.task.description,
  priority: props.task.priority,
  deadline: props.task.deadline,
});

watch(
  () => props.task,
  (newTask) => {
    updatedTask.value = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      deadline: newTask.deadline,
    };
  },
  { immediate: true },
);

const handleTaskUpdate = (task: UpdateTask) => {
  updatedTask.value = task;
  emit('confirm', task);
};
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
            <TaskEditForm ref="editForm" :task="updatedTask" @submit="handleTaskUpdate" />
          </div>
          <div class="flex flex-col sm:flex-row gap-6 w-full justify-between items-center">
            <div class="flex items-center gap-2">
              <Icon icon="ph:warning-circle" class="w-6 h-6 text-error flex-shrink-0" />
              <DialogDescription class="text-base-content-200 text-sm">
                Souhaitez-vous appliquer ces modifications à la tâche ? Cette action est
                irréversible.
              </DialogDescription>
            </div>
            <div class="flex gap-3">
              <DialogClose as="button">
                <UiButton text="Annuler" variant="accent" />
              </DialogClose>
              <UiButton text="Modifier" variant="ghost" @click="editForm?.handleSubmit()" />
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </DialogRoot>
</template>

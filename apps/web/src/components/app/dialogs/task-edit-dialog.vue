<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
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
const emit = defineEmits<{
  close: [];
  confirm: [task: UpdateTask, tagsToCreate: Array<{ name: string; color?: string }>];
}>();

const editForm = useTemplateRef('editForm');

const updatedTask = ref<UpdateTask & { tags?: typeof props.task.tags }>({
  title: props.task.title,
  description: props.task.description,
  priority: props.task.priority,
  deadline: props.task.deadline,
  tags: props.task.tags,
});

watch(
  () => props.task,
  (newTask) => {
    updatedTask.value = {
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      deadline: newTask.deadline,
      tags: newTask.tags,
    };
  },
  { immediate: true },
);

const handleTaskUpdate = (
  task: UpdateTask,
  tagsToCreate: Array<{ name: string; color?: string }>,
) => {
  emit('confirm', task, tagsToCreate);
};
</script>

<template>
  <DialogRoot :open="open" @update:open="(val) => !val && $emit('close')">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-30 flex items-center justify-center bg-base-content-100/30"
      />
      <DialogContent
        class="max-w-xl px-4 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] -ml-[calc(var(--scrollbar-width)/2)]"
      >
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
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

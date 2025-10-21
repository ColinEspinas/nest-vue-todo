<script setup lang="ts">
import { ref } from 'vue';
import UiButton from '@/components/ui/ui-button.vue';
import PrioritySelect from '@/components/app/inputs/priority-select.vue';
import DatePicker from '@/components/app/inputs/date-picker.vue';
import { useFormValidation } from '@/composables/use-form-validation';
import { createTaskSchema } from '@/schemas';
import type { CreateTask } from '@/types/task';

const title = ref('');
const description = ref('');
const priority = ref<'high' | 'medium' | 'low'>('medium');
const deadline = ref<Date | null>(null);

const emit = defineEmits<{
  submit: [task: CreateTask];
}>();

const isSubmitting = ref(false);
const { getError, hasError, validate } = useFormValidation(createTaskSchema);

const handleSubmit = async () => {
  const formData = {
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    deadline: deadline.value || undefined,
  };

  if (!validate(formData)) {
    return;
  }

  isSubmitting.value = true;

  try {
    emit('submit', formData);

    title.value = '';
    description.value = '';
    priority.value = 'medium';
    deadline.value = null;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form
    class="flex flex-col border-2 border-base-300 rounded-xl sm:rounded-2xl bg-base-100 overflow-hidden"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <div class="border-b-2 border-base-300">
      <label for="task-title" class="text-sm font-medium text-base-content-100 ml-3 mt-3 block">
        Titre
      </label>
      <input
        v-model="title"
        type="text"
        id="task-title"
        placeholder="Entrez le titre de la tâche"
        maxlength="50"
        autocomplete="off"
        class="py-2 px-3 outline-none text-sm w-full"
      />
      <div class="flex justify-between items-center px-3 pb-3">
        <span class="text-xs text-base-content-300">{{ title.length }}/50 caractères</span>
        <span v-if="hasError('title')" class="text-xs text-error">{{ getError('title') }}</span>
      </div>
    </div>

    <div class="flex flex-col">
      <label for="task-description" class="text-sm font-medium text-base-content-100 ml-3 mt-3">
        Description
      </label>
      <textarea
        v-model="description"
        id="task-description"
        placeholder="Entrez la description de la tâche"
        maxlength="256"
        rows="4"
        autocomplete="off"
        class="py-2 px-3 outline-none resize-none h-24 text-sm"
      ></textarea>
      <div class="flex justify-between items-center px-3 pb-2">
        <span class="text-xs text-base-content-300"> {{ description.length }}/256 caractères </span>
        <span v-if="hasError('description')" class="text-xs text-error">
          {{ getError('description') }}
        </span>
      </div>
    </div>
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-base-200/50"
    >
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <DatePicker v-model="deadline" placeholder="Pas d'échéance" />
        <PrioritySelect v-model="priority" />
      </div>
      <UiButton
        text="Ajouter aux tâches"
        variant="accent"
        type="submit"
        :disabled="isSubmitting"
        after-icon="ph:arrow-bend-right-down-bold"
        class="w-full sm:w-auto"
      />
    </div>
  </form>
</template>

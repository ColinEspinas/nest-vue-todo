<script setup lang="ts">
import { ref, watch } from 'vue';
import PrioritySelect from '@/components/app/inputs/priority-select.vue';
import DatePicker from '@/components/app/inputs/date-picker.vue';
import { useFormValidation } from '@/composables/use-form-validation';
import { createTaskSchema } from '@/schemas';
import type { UpdateTask } from '@/types/task';

const props = defineProps<{ loading?: boolean; task: UpdateTask }>();

const emit = defineEmits<{
  submit: [task: UpdateTask];
}>();

const { getError, hasError, validate } = useFormValidation(createTaskSchema);

const updatedTask = ref<UpdateTask>({
  title: props.task.title,
  description: props.task.description,
  priority: props.task.priority,
  deadline: props.task.deadline,
});

const handleSubmit = async () => {
  if (!validate(updatedTask.value)) {
    return;
  }

  emit('submit', updatedTask.value);
};

defineExpose({
  handleSubmit,
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
        v-model="updatedTask.title"
        type="text"
        id="task-title"
        placeholder="Entrez le titre de la tâche"
        maxlength="50"
        autocomplete="off"
        class="py-2 px-3 outline-none text-sm w-full"
      />
      <div class="flex justify-between items-center px-3 pb-3">
        <span class="text-xs text-base-content-300"
          >{{ updatedTask.title?.length ?? 0 }}/50 caractères</span
        >
        <span v-if="hasError('title')" class="text-xs text-error">{{ getError('title') }}</span>
      </div>
    </div>

    <div class="flex flex-col">
      <label for="task-description" class="text-sm font-medium text-base-content-100 ml-3 mt-3">
        Description
      </label>
      <textarea
        v-model="updatedTask.description"
        id="task-description"
        placeholder="Entrez la description de la tâche"
        maxlength="256"
        rows="4"
        autocomplete="off"
        class="py-2 px-3 outline-none resize-none h-24 text-sm"
      ></textarea>
      <div class="flex justify-between items-center px-3 pb-2">
        <span class="text-xs text-base-content-300">
          {{ updatedTask.description?.length ?? 0 }}/256 caractères
        </span>
        <span v-if="hasError('description')" class="text-xs text-error">
          {{ getError('description') }}
        </span>
        <span v-if="hasError('deadline')" class="text-xs text-error">
          {{ getError('deadline') }}
        </span>
        <span v-if="hasError('priority')" class="text-xs text-error">
          {{ getError('priority') }}
        </span>
      </div>
    </div>
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 bg-base-200/50"
    >
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <DatePicker v-model="updatedTask.deadline" placeholder="Pas d'échéance" />
        <PrioritySelect v-model="updatedTask.priority" />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { defineProps, defineModel, useId } from 'vue';

const value = defineModel<string>();

withDefaults(
  defineProps<{
    name: string;
    type?: string;
    label?: string;
    placeholder?: string;
    error?: string;
    id?: string;
    required?: boolean;
    autocomplete?: string;
    disabled?: boolean;
  }>(),
  {
    disabled: false,
    id: () => useId(),
    type: 'text',
  },
);
</script>

<template>
  <div class="flex flex-col gap-1 w-full">
    <label v-if="label" :for="id" class="text-sm">{{ label }}</label>
    <input
      :name
      :id
      :type
      :placeholder
      v-model="value"
      :required
      :autocomplete
      :disabled
      class="transition-all bg-base-100 focus-within:border-base-300 border-2 border-base-200 bg-base-50 rounded-lg p-2 outline-none w-full flex flex-col items-end gap-2"
    />
    <span v-if="error" class="text-error text-xs">{{ error }}</span>
  </div>
</template>

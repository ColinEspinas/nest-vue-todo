<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useId } from 'vue';

withDefaults(
  defineProps<{
    checked: boolean;
    disabled?: boolean;
    label?: string;
    ariaLabel?: string;
    id?: string;
  }>(),
  {
    disabled: false,
    id: () => useId(),
  },
);

const emits = defineEmits<{
  change: [checked: boolean];
}>();
</script>

<template>
  <label class="inline-flex items-center cursor-pointer">
    <div class="relative flex-shrink-0">
      <input
        :id
        type="checkbox"
        :checked
        :disabled
        :aria-label="ariaLabel"
        class="sr-only"
        @change="emits('change', !checked)"
      />
      <div
        :class="[
          'w-5 h-5 border-2 rounded transition-all duration-300 ease-out',
          'flex items-center justify-center flex-shrink-0',
          'ring-0 ring-base-content-100/20 hover:ring-3',
          checked
            ? 'bg-base-content-100 border-base-content-100 scale-100'
            : 'bg-base-100 border-base-300 hover:border-base-content-200 hover:bg-base-200 scale-100',
          disabled && 'opacity-50 cursor-not-allowed',
        ]"
      >
        <Icon
          icon="ph:check-bold"
          :class="[
            'w-3 h-3 transition-all ease-out text-white',
            checked ? 'opacity-100 scale-100 duration-200' : 'opacity-0 scale-50 duration-150',
          ]"
          :style="{
            transitionTimingFunction: checked
              ? 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }"
          aria-hidden="true"
        />
      </div>
    </div>
    <span v-if="label" class="ml-3 text-sm text-base-content-100 select-none">
      {{ label }}
    </span>
  </label>
</template>

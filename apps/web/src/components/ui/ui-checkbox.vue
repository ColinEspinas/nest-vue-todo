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
  <label class="inline-flex items-center cursor-pointer group">
    <div class="relative flex-shrink-0">
      <input
        :id
        type="checkbox"
        :checked
        :disabled
        :aria-label="ariaLabel"
        class="sr-only peer"
        @change="emits('change', !checked)"
      />
      <div
        class="w-5 h-5 border-2 rounded transition-all duration-300 ease-out flex items-center justify-center flex-shrink-0 ring-0 ring-accent/20 bg-base-100 border-base-300 scale-100 peer-checked:bg-accent peer-checked:border-accent peer-checked:scale-100 peer-disabled:opacity-50 peer-disabled:cursor-not-allowed peer-hover:ring-3 peer-hover:border-accent peer-disabled:hover:ring-0 peer-disabled:hover:border-base-300 peer-disabled:hover:bg-base-100 peer-checked:peer-disabled:hover:bg-accent peer-checked:peer-disabled:hover:border-accent"
        :class="[!checked && 'peer-hover:bg-base-200']"
      >
        <Icon
          icon="ph:check-bold"
          :class="[
            'w-3.5 h-3.5 transition-all ease-out',
            checked
              ? 'opacity-100 scale-100 duration-200 text-base-100'
              : 'opacity-0 scale-50 duration-150 text-base-content-100',
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

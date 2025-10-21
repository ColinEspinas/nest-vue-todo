<script setup lang="ts">
import { Icon } from '@iconify/vue';

defineProps<{
  label: string;
  icon?: string;
  iconColor?: string;
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
}>();
</script>

<template>
  <span
    :class="[
      'flex gap-1 items-center px-2 py-1 text-xs rounded-full font-medium border',
      textColor || 'text-base-content-200',
      bgColor || 'bg-base-100',
      borderColor || 'border-base-300',
    ]"
  >
    <Icon v-if="icon" :icon="icon" :class="['w-3 h-3', iconColor || 'text-base-content-200']" />
    {{ label }}
  </span>
</template>

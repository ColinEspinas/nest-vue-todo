<script setup lang="ts">
import { Icon } from '@iconify/vue';

interface Props {
  /** Size of the icon in pixels */
  size?: number;
  /** Whether to show the text label */
  showText?: boolean;
  /** Size variant */
  variant?: 'sm' | 'md' | 'lg';
}

withDefaults(defineProps<Props>(), {
  size: 16,
  showText: true,
  variant: 'md',
});

const sizeClasses = {
  sm: {
    icon: 'w-3 h-3',
    text: 'text-sm',
    padding: 'p-0.5',
  },
  md: {
    icon: 'w-4 h-4',
    text: 'text-lg',
    padding: 'p-1',
  },
  lg: {
    icon: 'w-5 h-5',
    text: 'text-xl',
    padding: 'p-1.5',
  },
};
</script>

<template>
  <div class="flex items-center justify-center gap-2 font-medium">
    <div
      class="flex items-center justify-center rounded-lg bg-accent/20"
      :class="sizeClasses[variant].padding"
    >
      <Icon icon="ph:checks-bold" :class="sizeClasses[variant].icon" class="text-accent" />
    </div>
    <p v-if="showText" class="font-bold" :class="sizeClasses[variant].text">Checkmate</p>
  </div>
</template>

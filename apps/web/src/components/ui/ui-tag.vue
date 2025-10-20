<script setup lang="ts">
defineProps<{
  label: string;
  variant?: 'high' | 'medium' | 'low' | 'default';
}>();

const getVariantClasses = (variant: string = 'default') => {
  switch (variant) {
    case 'high':
      return 'text-error bg-base-100 border-base-300';
    case 'medium':
      return 'text-accent bg-base-100 border-base-300';
    case 'low':
      return 'text-success bg-base-100 border-base-300';
    default:
      return 'text-base-content-200 bg-base-100 border-base-300';
  }
};
</script>

<template>
  <span :class="['px-2 py-1 text-xs rounded-full font-medium border', getVariantClasses(variant)]">
    {{ label }}
  </span>
</template>

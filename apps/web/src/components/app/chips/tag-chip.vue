<script setup lang="ts">
import { DEFAULT_TAG_COLOR } from '@/config/tag-colors';
import type { Tag } from '@/types/task';

defineProps<{
  tag: Tag;
}>();
</script>

<template>
  <span
    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border"
    :style="{
      backgroundColor: tag.color ? `${tag.color}20` : `${DEFAULT_TAG_COLOR}20`,
      borderColor: tag.color || DEFAULT_TAG_COLOR,
      color: tag.color || DEFAULT_TAG_COLOR,
    }"
  >
    #{{ tag.name }}
  </span>
</template>

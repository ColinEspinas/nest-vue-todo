<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { ExtractedTag } from '@/composables/use-hashtag-tags';

interface Props {
  tags: ExtractedTag[];
  maxTags?: number;
  getTagColor: (tag: ExtractedTag) => string;
}

withDefaults(defineProps<Props>(), {
  maxTags: 3,
});

defineEmits<{
  'remove-tag': [tagName: string];
}>();
</script>

<template>
  <div v-if="tags.length" class="flex flex-wrap gap-1.5 px-3 pb-2">
    <span
      v-for="tag in tags"
      :key="tag.name"
      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border"
      :style="{
        backgroundColor: `${getTagColor(tag)}20`,
        borderColor: getTagColor(tag),
        color: getTagColor(tag),
      }"
    >
      <Icon v-if="tag.isNew" icon="ph:plus-bold" class="w-3 h-3" />
      <span class="text-xs">#{{ tag.name }}</span>
      <button
        type="button"
        class="hover:opacity-70 transition-opacity cursor-pointer"
        @click="$emit('remove-tag', tag.name)"
      >
        <Icon icon="ph:x" class="w-2.5 h-2.5" />
      </button>
    </span>
    <span class="text-xs text-base-content-300 self-center"> {{ tags.length }}/{{ maxTags }} </span>
  </div>
</template>

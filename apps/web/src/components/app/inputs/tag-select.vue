<script setup lang="ts">
import {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectViewport,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from 'reka-ui';
import TagChip from '@/components/app/chips/tag-chip.vue';
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Tag } from '@/types/task';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  availableTags: Tag[];
  extractedTags: { name: string }[];
  canAddMoreTags: boolean;
}>();

const emit = defineEmits<{
  select: [tagId: string];
}>();

const { t } = useI18n();
const selectedTagOption = ref(null);
const availableTagOptions = computed(() => {
  return props.availableTags.filter(
    (tag: Tag) =>
      !props.extractedTags.some(
        (t: { name: string }) => t.name.toLowerCase() === tag.name.toLowerCase(),
      ),
  );
});
function handleTagSelector(value: string | null) {
  if (value) {
    emit('select', value);
    selectedTagOption.value = null;
  }
}
</script>

<template>
  <div v-if="canAddMoreTags && availableTagOptions.length" class="relative">
    <SelectRoot v-model="selectedTagOption" @update:modelValue="handleTagSelector">
      <SelectTrigger
        class="outline-none flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border border-dashed text-base-content-100/60 bg-transparent hover:bg-base-content-100/5 transition-colors cursor-pointer"
        aria-label="Select tag to add"
      >
        <span class="text-xs">{{ t('tags.addTag') }}</span>
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          class="z-50 max-h-48 max-w-80 bg-base-100 border-2 border-base-content-100/20 rounded-lg shadow-lg overflow-y-auto"
          :side-offset="4"
          :collision-padding="8"
          position="popper"
        >
          <SelectScrollUpButton
            class="flex items-center justify-center w-full py-1 text-xs text-base-content-300 bg-base-100 hover:bg-base-200 cursor-pointer border-b border-base-300"
          >
            <Icon icon="ph:caret-up" class="w-3 h-3" />
          </SelectScrollUpButton>
          <SelectViewport>
            <SelectItem
              v-for="tag in availableTagOptions"
              :key="tag.id"
              :value="tag.id"
              class="px-3 py-2 data-[highlighted]:bg-base-200 flex items-center gap-2 cursor-pointer outline-none"
            >
              <TagChip :tag="tag" />
            </SelectItem>
          </SelectViewport>
          <SelectScrollDownButton
            class="flex items-center justify-center w-full py-1 text-xs text-base-content-300 bg-base-100 hover:bg-base-200 cursor-pointer border-t border-base-300"
          >
            <Icon icon="ph:caret-down" class="w-3 h-3" />
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>

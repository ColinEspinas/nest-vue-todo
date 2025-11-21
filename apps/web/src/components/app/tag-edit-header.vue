<script setup lang="ts">
import { ref, useTemplateRef, nextTick } from 'vue';
import { Icon } from '@iconify/vue';
import UiButton from '@/components/ui/ui-button.vue';
import UiColorPicker from '@/components/app/inputs/color-picker.vue';
import type { Tag } from '@/types/task';

const props = defineProps<{
  tag: Tag;
}>();

const emit = defineEmits<{
  updateName: [name: string];
  updateColor: [color: string];
  delete: [];
}>();

const isEditingTagName = ref(false);
const tagNameRef = useTemplateRef<HTMLElement>('tagNameRef');
const originalTagName = ref('');

/**
 * Moves the cursor to the end of the contenteditable element
 */
const moveCursorToEnd = (element: HTMLElement) => {
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(element);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
};

/**
 * Replaces spaces with hyphens in the tag name
 */
const normalizeTagName = (text: string) => text.replace(/\s+/g, '-');

/**
 * Starts editing mode for the tag name
 */
const startEditingTagName = async () => {
  originalTagName.value = props.tag.name;
  isEditingTagName.value = true;

  await nextTick();
  if (tagNameRef.value) {
    tagNameRef.value.focus();
    moveCursorToEnd(tagNameRef.value);
  }
};

/**
 * Handles input events to replace spaces with hyphens in real-time
 */
const handleTagNameInput = (event: Event) => {
  const target = event.target as HTMLElement;
  const text = target.textContent || '';
  const normalizedText = normalizeTagName(text);

  if (text !== normalizedText) {
    target.textContent = normalizedText;
    moveCursorToEnd(target);
  }
};

/**
 * Saves the edited tag name
 */
const saveTagName = () => {
  if (!tagNameRef.value) return;

  const newName = normalizeTagName(tagNameRef.value.textContent?.trim() || '');

  if (newName && newName !== originalTagName.value) {
    emit('updateName', newName);
  } else if (!newName) {
    tagNameRef.value.textContent = originalTagName.value;
  }

  isEditingTagName.value = false;
};

/**
 * Cancels editing and restores the original tag name
 */
const cancelEditingTagName = () => {
  if (tagNameRef.value) {
    tagNameRef.value.textContent = originalTagName.value;
  }
  isEditingTagName.value = false;
};

/**
 * Handles color updates from the color picker
 */
const handleColorUpdate = (color: string | null) => {
  if (color) {
    emit('updateColor', color);
  }
};
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <!-- Color Picker -->
      <UiColorPicker :model-value="tag.color" @update:model-value="handleColorUpdate" />

      <!-- Title - clickable for inline editing -->
      <div class="flex items-center gap-2 group">
        <h1
          ref="tagNameRef"
          :contenteditable="isEditingTagName"
          @click="!isEditingTagName && startEditingTagName()"
          @input="handleTagNameInput"
          @keyup.enter.prevent="saveTagName"
          @keyup.escape="cancelEditingTagName"
          @blur="saveTagName"
          :class="[
            'text-xl font-bold outline-none py-0.5 rounded-lg px-2 -mx-2',
            isEditingTagName
              ? 'cursor-text bg-base-100 border-2 border-base-300'
              : 'cursor-pointer border-2 border-transparent',
          ]"
        >
          {{ tag.name }}
        </h1>
        <Icon
          v-if="!isEditingTagName"
          icon="ph:pencil-simple"
          class="w-4 h-4 text-base-content-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          @click="startEditingTagName"
        />
      </div>
    </div>
    <div class="flex gap-2">
      <UiButton variant="ghost" shape="rounded" @click="$emit('delete')" before-icon="ph:trash">
      </UiButton>
    </div>
  </div>
</template>

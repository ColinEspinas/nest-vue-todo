<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ReferenceElement } from 'reka-ui';
import { computedWithControl } from '@vueuse/core';
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
} from 'reka-ui';
import TagChip from '@/components/app/chips/tag-chip.vue';
import type { Tag } from '@/types/task';
import type { ExtractedTag } from '@/composables/use-hashtag-tags';

interface Props {
  availableTags: Tag[];
  extractedTags: ExtractedTag[];
  canAddMoreTags: boolean;
  tagDetectionEnabled: boolean;
  maxLength?: number;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxLength: 50,
  placeholder: '',
});

const emit = defineEmits<{
  'tag-added': [tagName: string, hashtagStart: number, cursorPos: number];
  'tag-selected': [tagName: string, hashtagStart: number];
  'disable-detection': [];
  'enable-detection': [];
}>();

const modelValue = defineModel<string>({ required: true });

const open = ref(false);
const searchValue = ref('');
const inputRef = ref<InstanceType<typeof ComboboxInput>>();

// Get anchor position for combobox dropdown
const getAnchorRect = (input: HTMLInputElement) => {
  const span = document.createElement('span');
  const computed = window.getComputedStyle(input);

  span.style.font = computed.font;
  span.style.padding = computed.padding;
  span.style.whiteSpace = 'pre';
  span.textContent = modelValue.value.slice(0, input.selectionStart || 0);

  document.body.appendChild(span);
  const rect = input.getBoundingClientRect();
  const spanRect = span.getBoundingClientRect();
  document.body.removeChild(span);

  return {
    x: rect.left + spanRect.width,
    y: rect.top,
    height: rect.height,
  };
};

const reference = computedWithControl(
  () => [searchValue.value, open.value],
  () =>
    ({
      getBoundingClientRect: () => {
        if (inputRef.value?.$el) {
          const { x, y, height } = getAnchorRect(inputRef.value.$el);
          return { x, y, height, top: y, left: x, width: 0 };
        }
        return null;
      },
    }) as ReferenceElement,
);

// Filter tags based on search
const filteredTags = computed(() => {
  const search = searchValue.value.toLowerCase();

  return props.availableTags
    .filter((tag) => {
      const alreadyExtracted = props.extractedTags.some(
        (t) => t.name.toLowerCase() === tag.name.toLowerCase(),
      );
      if (alreadyExtracted) return false;

      if (!search) return true;
      return tag.name.toLowerCase().includes(search);
    })
    .slice(0, 5);
});

// Use VueUse to sync caret position
const inputElement = computed(() => inputRef.value?.$el as HTMLInputElement | undefined);

// Handle input changes to detect hashtags
function handleChange(ev: InputEvent) {
  const target = ev.target as HTMLInputElement;
  const cursorPos = target.selectionStart || 0;
  // Use the current input value, not modelValue (which hasn't been updated yet)
  const currentValue = target.value;
  const textBeforeCursor = currentValue.slice(0, cursorPos);

  // Re-enable tag detection only if user types a new # character
  if (!props.tagDetectionEnabled) {
    if (ev.data === '#') {
      emit('enable-detection');
    } else {
      searchValue.value = '';
      open.value = false;
      return;
    }
  }

  // Check for hashtag followed by space (to add tag)
  const hashtagWithSpace = textBeforeCursor.match(/#([\w-]+)\s$/);

  if (hashtagWithSpace && hashtagWithSpace[1] && props.canAddMoreTags) {
    const tagName = hashtagWithSpace[1];
    const hashtagStart = cursorPos - hashtagWithSpace[0].length;

    emit('tag-added', tagName, hashtagStart, cursorPos);
    searchValue.value = '';
    open.value = false;
    return;
  }

  // Check for hashtag pattern (for dropdown)
  const hashtagMatch = textBeforeCursor.match(/#([\w-]*)$/);

  if (hashtagMatch && props.canAddMoreTags) {
    searchValue.value = hashtagMatch[1] || '';
    open.value = true;
  } else {
    searchValue.value = '';
    open.value = false;
  }
}

// Handle escape key to disable tag detection
function handleKeyDown(ev: KeyboardEvent) {
  if (ev.key === 'Escape') {
    emit('disable-detection');
    open.value = false;
    searchValue.value = '';
  }
}

// Handle tag selection from dropdown
function handleSelect(ev: CustomEvent) {
  const input = inputElement.value;
  if (!input) return;

  const selectedTagName = ev.detail.value;

  // Prevent default combobox behavior
  ev.preventDefault();

  // Find hashtag position
  const cursorPos = input.selectionStart || 0;
  const textBeforeCursor = input.value.slice(0, cursorPos);
  const hashtagMatch = textBeforeCursor.match(/#([\w-]*)$/);

  if (hashtagMatch) {
    const hashtagStart = cursorPos - hashtagMatch[0].length;
    emit('tag-selected', selectedTagName, hashtagStart);

    // Set cursor position after a tick
    requestAnimationFrame(() => {
      input.setSelectionRange(hashtagStart, hashtagStart);
    });
  }

  searchValue.value = '';
  open.value = false;
}
</script>

<template>
  <ComboboxRoot v-model:open="open" ignore-filter :reset-search-term-on-blur="false">
    <ComboboxInput
      ref="inputRef"
      v-model="modelValue"
      :display-value="() => modelValue"
      type="text"
      :placeholder="placeholder"
      :maxlength="maxLength"
      autocomplete="off"
      class="py-2 px-3 outline-none text-sm w-full"
      @input="handleChange"
      @keydown="handleKeyDown"
      @pointerdown="open = false"
      @keydown.enter="
        (ev: KeyboardEvent) => {
          if (open) ev.preventDefault();
        }
      "
      @keydown.left.right="open = false"
    />

    <ComboboxAnchor :reference="reference" />

    <ComboboxPortal>
      <ComboboxContent
        v-if="open && searchValue"
        position="popper"
        side="bottom"
        align="start"
        class="z-50 max-h-48 max-w-80 bg-base-100 border-2 border-base-content-100/20 rounded-lg shadow-lg overflow-y-auto"
      >
        <ComboboxItem
          v-for="tag in filteredTags"
          :key="tag.id"
          :value="tag.name"
          class="px-3 py-2 data-[highlighted]:bg-base-200 flex items-center gap-2 cursor-pointer outline-none"
          @select="handleSelect"
        >
          <TagChip :tag="tag" />
        </ComboboxItem>

        <!-- No results message -->
        <div
          v-if="filteredTags.length === 0"
          class="px-3 py-2 text-sm text-base-content-300 italic"
        >
          Appuyez sur espace pour créer le tag "#{{ searchValue }}"
        </div>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>

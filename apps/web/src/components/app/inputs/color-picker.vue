<script setup lang="ts">
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { PopoverRoot, PopoverTrigger, PopoverPortal, PopoverContent, PopoverArrow } from 'reka-ui';
import { TAG_COLORS, DEFAULT_TAG_COLOR } from '@/config/tag-colors';

const color = defineModel<string | null>({ required: true });
const open = ref(false);

/**
 * Returns the current color or the default if none is selected
 */
const displayColor = computed(() => color.value || DEFAULT_TAG_COLOR);

/**
 * Selects a new color and closes the popover
 */
const selectColor = (newColor: string) => {
  color.value = newColor;
  open.value = false;
};
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <button
        class="flex items-center justify-center w-8 h-8 rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
        :style="{
          backgroundColor: `${displayColor}20`,
          borderColor: displayColor,
        }"
      >
        <Icon icon="ph:hash-bold" class="w-4 h-4" :style="{ color: displayColor }" />
      </button>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="8"
        align="start"
        class="z-10 bg-base-100 p-3 rounded-lg border-2 border-base-300 shadow-lg min-w-[200px]"
      >
        <PopoverArrow class="fill-base-300" :width="12" :height="6" />
        <div class="grid grid-cols-5 gap-2">
          <button
            v-for="tagColor in TAG_COLORS"
            :key="tagColor"
            @click="selectColor(tagColor)"
            class="w-8 h-8 rounded-lg border-1 hover:scale-110 transition-transform flex-shrink-0 flex items-center justify-center cursor-pointer"
            :style="{
              backgroundColor: `${tagColor}40`,
              borderColor: tagColor,
            }"
          >
            <Icon icon="ph:hash-bold" class="w-3 h-3" :style="{ color: tagColor }" />
          </button>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

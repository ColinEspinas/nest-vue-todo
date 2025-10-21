<script setup lang="ts">
import {
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui';

withDefaults(
  defineProps<{
    content: string;
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    delayDuration?: number;
    disabled?: boolean;
  }>(),
  {
    side: 'bottom',
    align: 'center',
    delayDuration: 200,
    disabled: false,
  },
);
</script>

<template>
  <TooltipProvider>
    <TooltipRoot :delay-duration="delayDuration">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>

      <TooltipPortal v-if="!disabled">
        <TooltipContent
          :side="side"
          :align="align"
          :side-offset="6"
          class="z-50 rounded-md bg-base-content-100 px-2 py-1 text-xs text-base-100 shadow-md border border-base-content-100/20 max-w-60"
        >
          {{ content }}
          <TooltipArrow class="fill-base-content-100" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

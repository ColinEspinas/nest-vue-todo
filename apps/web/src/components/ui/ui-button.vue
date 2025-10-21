<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useMouseInElement } from '@vueuse/core';
import { computed, useTemplateRef } from 'vue';

const props = withDefaults(
  defineProps<{
    text?: string;
    afterIcon?: string;
    beforeIcon?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'text';
    align?: 'left' | 'center' | 'right';
    size?: 'sm' | 'md' | 'lg';
    shape?: 'rounded' | 'default';
    loading?: boolean;
    to?: string;
    target?: '_blank' | '_self';
    external?: boolean;
    ariaLabel?: string;
  }>(),
  {
    type: 'button',
    disabled: false,
    variant: 'primary',
    align: 'left',
    shape: 'default',
    size: 'md',
    external: false,
  },
);

const emits = defineEmits<{
  click: [];
}>();

const variantClasses = {
  primary:
    'bg-base-content-100 text-base-100 ring-0 border-2 border-transparent ring-base-content-100/20 hover:ring-3 transition-all',
  secondary:
    'bg-base-100 text-base-content-100 border-2 border-base-content-100/20 ring-0 ring-base-content-100/10 not-disabled:hover:ring-3 transition-all disabled:bg-base-200 disabled:text-base-content-300 disabled:cursor-default',
  accent:
    'bg-accent text-accent-content ring-0 ring-accent/25 hover:ring-3 border-2 border-accent transition-all bg-radial-(--gradient-position) from-accent-content/20 to-transparent to-50%',
  ghost:
    'bg-transparent text-base-content-100 ring-0 ring-base-content-100/10 hover:ring-3 border-2 border-base-content-100/20 transition-all disabled:text-base-content-300 disabled:cursor-default',
  text: 'bg-transparent text-base-content-100 ring-0 ring-base-content-100/10 hover:ring-3 border-0 transition-all disabled:text-base-content-300 disabled:cursor-default',
};

const alignClasses = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
};

const shapeClasses = {
  rounded: 'rounded-full',
  default: 'rounded-lg',
};

const sizeClasses = {
  sm: 'text-xs py-1.5 px-2.5',
  md: 'text-sm py-2 px-3',
  lg: 'text-base py-3 px-6',
};

const buttonRef = useTemplateRef<HTMLDivElement>('button');
const { elementX, elementY, elementHeight, elementWidth } = useMouseInElement(buttonRef);

const gradientPosition = computed(() => {
  if (!['accent'].includes(props.variant)) return '';
  const padding = 100;
  if (
    elementX.value > -padding &&
    elementX.value < elementWidth.value + padding &&
    elementY.value > -padding &&
    elementY.value < elementHeight.value + padding
  ) {
    return `circle at ${elementX.value}px ${elementY.value}px`;
  }
  return '';
});
</script>

<template>
  <RouterLink
    v-if="to && !external"
    ref="button"
    :to="to"
    class="flex gap-2 items-center outline-none font-medium not-disabled:active:scale-95 cursor-pointer"
    :class="[variantClasses[variant], alignClasses[align], shapeClasses[shape], sizeClasses[size]]"
    :style="{ '--gradient-position': gradientPosition }"
    :aria-label="ariaLabel"
  >
    <div
      v-if="loading"
      class="absolute inset-0 w-full h-full flex items-center justify-center"
      aria-hidden
    >
      <Icon
        icon="ph:circle-notch-bold"
        class="animate-spin"
        :size="size === 'sm' ? 18 : size === 'md' ? 22 : 26"
      />
    </div>
    <Icon
      v-if="beforeIcon"
      :class="['my-1', { 'opacity-0': loading }]"
      :size="size === 'sm' ? 16 : size === 'md' ? 18 : 20"
      :icon="beforeIcon"
    />
    <span v-if="text" :class="{ 'opacity-0': loading }">{{ text }}</span>
    <Icon
      v-if="afterIcon"
      :class="['my-1', { 'opacity-0': loading }]"
      :size="size === 'sm' ? 16 : size === 'md' ? 18 : 20"
      :icon="afterIcon"
    />
  </RouterLink>
  <a
    v-else-if="to && external"
    ref="button"
    :href="to"
    :target="target"
    rel="noopener noreferrer"
    class="flex gap-2 items-center outline-none font-medium not-disabled:active:scale-95 cursor-pointer"
    :style="{ '--gradient-position': gradientPosition }"
    :class="[variantClasses[variant], alignClasses[align], shapeClasses[shape], sizeClasses[size]]"
    :aria-label="ariaLabel"
  >
    <div
      v-if="loading"
      class="absolute inset-0 w-full h-full flex items-center justify-center"
      aria-hidden
    >
      <Icon
        icon="ph:circle-notch-bold"
        class="animate-spin"
        :size="size === 'sm' ? 18 : size === 'md' ? 22 : 26"
      />
    </div>
    <Icon
      v-if="beforeIcon"
      :class="['my-1', { 'opacity-0': loading }]"
      :size="size === 'sm' ? 16 : size === 'md' ? 18 : 20"
      :icon="beforeIcon"
    />
    <span v-if="text" :class="{ 'opacity-0': loading }">{{ text }}</span>
    <Icon
      v-if="afterIcon"
      :class="['my-1', { 'opacity-0': loading }]"
      :size="size === 'sm' ? 16 : size === 'md' ? 18 : 20"
      :icon="afterIcon"
    />
  </a>
  <button
    v-else
    ref="button"
    class="flex gap-2 items-center outline-none font-medium not-disabled:active:scale-95 cursor-pointer relative"
    :style="{ '--gradient-position': gradientPosition }"
    :disabled="disabled"
    :class="[variantClasses[variant], alignClasses[align], shapeClasses[shape], sizeClasses[size]]"
    :type="type"
    :aria-label="ariaLabel"
    @click="emits('click')"
  >
    <div
      v-if="loading"
      class="absolute inset-0 w-full h-full flex items-center justify-center"
      aria-hidden
    >
      <Icon
        icon="ph:circle-notch-bold"
        class="animate-spin"
        :size="size === 'sm' ? 18 : size === 'md' ? 22 : 26"
      />
    </div>
    <Icon
      v-if="beforeIcon"
      :class="['my-1', { 'opacity-0': loading }]"
      :size="size === 'sm' ? 16 : size === 'md' ? 18 : 20"
      :icon="beforeIcon"
    />
    <span v-if="text" :class="{ 'opacity-0': loading }">{{ text }}</span>
    <Icon
      v-if="afterIcon"
      :class="['my-1', { 'opacity-0': loading }]"
      :size="size === 'sm' ? 16 : size === 'md' ? 18 : 20"
      :icon="afterIcon"
    />
  </button>
</template>

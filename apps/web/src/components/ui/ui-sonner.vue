<script setup lang="ts">
import { Toaster as Sonner } from 'vue-sonner';
import { useTheme } from '@/composables/use-theme';
import { computed } from 'vue';

const { mode } = useTheme();

const theme = computed(() => {
  if (mode.value === 'dark') return 'dark';
  if (mode.value === 'light') return 'light';
  return 'system';
});
</script>

<template>
  <Sonner :theme="theme" position="bottom-center" />
</template>

<style>
[data-sonner-toaster] {
  --normal-bg: var(--color-base-100);
  --normal-border: var(--color-base-300);
  --normal-text: var(--color-base-content-100);
}

[data-sonner-toast] {
  border-radius: 0.5rem;
  border-width: 2px;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  background-color: var(--normal-bg);
  border-color: var(--normal-border);
  color: var(--normal-text);
}

[data-sonner-toast][data-type='success'] {
  background-color: color-mix(in srgb, var(--color-success) 15%, var(--color-base-100));
  border-color: color-mix(in srgb, var(--color-success) 30%, transparent);
}

[data-sonner-toast][data-type='success'] [data-icon],
[data-sonner-toast][data-type='success'] [data-title] {
  color: var(--color-success);
}

[data-sonner-toast][data-type='error'] {
  background-color: color-mix(in srgb, var(--color-error) 15%, var(--color-base-100));
  border-color: color-mix(in srgb, var(--color-error) 30%, transparent);
}

[data-sonner-toast][data-type='error'] [data-icon],
[data-sonner-toast][data-type='error'] [data-title] {
  color: var(--color-error);
}

[data-sonner-toast][data-type='warning'] {
  background-color: color-mix(in srgb, var(--color-warning) 15%, var(--color-base-100));
  border-color: color-mix(in srgb, var(--color-warning) 30%, transparent);
}

[data-sonner-toast][data-type='warning'] [data-icon],
[data-sonner-toast][data-type='warning'] [data-title] {
  color: var(--color-warning);
}

[data-sonner-toast][data-type='info'] {
  background-color: color-mix(in srgb, var(--color-accent) 15%, var(--color-base-100));
  border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
}

[data-sonner-toast][data-type='info'] [data-icon],
[data-sonner-toast][data-type='info'] [data-title] {
  color: var(--color-accent);
}

[data-title] {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-base-content-100);
}

[data-description] {
  font-size: 0.875rem;
  color: var(--color-base-content-200);
}
</style>

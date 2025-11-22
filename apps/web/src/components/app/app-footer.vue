<script setup lang="ts">
import UiButton from '../ui/ui-button.vue';
import ThemeToggle from './theme-toggle.vue';
import LanguageSwitcher from './language-switcher.vue';
</script>

<template>
  <footer
    class="bg-base-200/50 px-4 pt-4 rounded-t-3xl border-2 border-b-0 border-base-content-100/10 mt-4"
  >
    <div
      class="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 p-4 rounded-t-2xl bg-base-100 border-2 border-b-0 border-base-300"
    >
      <span class="text-xs font-medium text-base-content-200"
        >© {{ new Date().getFullYear() }} Colin Espinas.</span
      >
      <div class="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
        <div class="w-px h-8 bg-base-300 mx-1"></div>
        <UiButton
          to="https://github.com/ColinEspinas/nest-vue-todo"
          external
          variant="ghost"
          before-icon="ph:github-logo-bold"
          aria-label="GitHub"
        />
      </div>
    </div>
  </footer>
</template>

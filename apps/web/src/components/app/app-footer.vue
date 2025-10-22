<script setup lang="ts">
import UiButton from '../ui/ui-button.vue';
</script>

<template>
  <footer
    class="bg-base-200/50 px-4 pt-4 rounded-t-3xl border-2 border-b-0 border-base-content-100/10 mt-4"
  >
    <div
      class="flex items-center justify-between bg-base-100 p-4 rounded-t-2xl border-2 border-b-0 border-base-300"
    >
      <span class="text-sm font-medium"
        >{{ new Date().getFullYear() }} Colin Espinas. MIT License.</span
      >
      <ul class="flex">
        <li>
          <UiButton
            to="https://github.com/ColinEspinas/nest-vue-todo"
            external
            variant="secondary"
            size="sm"
            before-icon="ph:github-logo-bold"
          />
        </li>
      </ul>
    </div>
  </footer>
</template>

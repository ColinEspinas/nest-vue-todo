<script setup lang="ts">
import AppNavbar from '@/components/app/app-navbar.vue';
</script>

<template>
  <div class="max-w-[600px] mx-auto p-4">
    <AppNavbar class="mb-4" />
    <main>
      <RouterView />
    </main>
  </div>
</template>

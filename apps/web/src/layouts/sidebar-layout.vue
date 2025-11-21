<script setup lang="ts">
import AppSidebar from '@/components/app/app-sidebar.vue';
</script>

<template>
  <div class="flex h-full mx-auto max-w-[900px]">
    <AppSidebar class="sticky left-0 top-4 h-[calc(100vh-2rem)] my-4" />
    <div class="flex flex-col justify-between max-w-[600px] p-4 min-h-screen">
      <main>
        <RouterView />
      </main>
    </div>
  </div>
</template>

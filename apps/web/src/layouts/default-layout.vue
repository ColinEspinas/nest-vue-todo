<script setup lang="ts">
import AppFooter from '@/components/app/app-footer.vue';
import AppNavbar from '@/components/app/app-navbar.vue';
</script>

<template>
  <div class="flex flex-col justify-between max-w-[600px] mx-auto p-4 pb-0 min-h-screen">
    <div>
      <AppNavbar class="mb-4" />
      <main>
        <RouterView />
      </main>
    </div>
    <AppFooter />
  </div>
</template>

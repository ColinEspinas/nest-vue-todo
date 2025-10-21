<template>
  <div class="space-y-4">
    <div
      v-for="i in 3"
      :key="i"
      class="flex flex-col gap-2 rounded-2xl border-2 border-base-300 p-4 bg-base-100 animate-pulse"
    >
      <header class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 bg-base-300 rounded"></div>
          <div class="h-5 bg-base-300 rounded w-32"></div>
        </div>
      </header>

      <div class="space-y-2 mb-3">
        <div class="h-4 bg-base-300 rounded w-full"></div>
        <div class="h-4 bg-base-300 rounded w-3/4"></div>
      </div>

      <footer class="flex items-center gap-2">
        <div class="h-4 bg-base-300 rounded-full w-12"></div>
        <div v-if="i % 2 === 0" class="h-4 bg-base-300 rounded-full w-16"></div>
        <div class="h-4 bg-base-300 rounded-full w-14"></div>
      </footer>
    </div>
  </div>
</template>

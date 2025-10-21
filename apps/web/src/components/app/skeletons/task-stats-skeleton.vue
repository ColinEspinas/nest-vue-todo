<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div
      v-for="n in 3"
      :key="n"
      class="bg-base-100 rounded-2xl border-2 border-base-300 p-6 animate-pulse"
    >
      <div class="h-8 bg-base-300 rounded mb-2 w-16"></div>
      <div class="h-4 bg-base-300 rounded w-24"></div>
    </div>
  </div>
</template>

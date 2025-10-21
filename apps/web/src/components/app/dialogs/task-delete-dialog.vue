<script setup lang="ts">
import { DialogRoot, DialogContent, DialogClose } from 'reka-ui';
import UiButton from '@/components/ui/ui-button.vue';

defineProps<{ open: boolean }>();
defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <DialogRoot :open="open" @update:open="(val) => !val && $emit('close')">
    <DialogContent class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-base-100 rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
        <h2 class="text-lg font-semibold mb-2 text-base-content-100">Supprimer la tâche ?</h2>
        <p class="text-base-content-200 mb-6 text-center">Cette action est irréversible.</p>
        <div class="flex gap-3 w-full justify-center">
          <DialogClose as="button">
            <UiButton text="Annuler" variant="accent" />
          </DialogClose>
          <UiButton text="Supprimer" variant="ghost" @click="$emit('confirm')" />
        </div>
      </div>
    </DialogContent>
  </DialogRoot>
</template>

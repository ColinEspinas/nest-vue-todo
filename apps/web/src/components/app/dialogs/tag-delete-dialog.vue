<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  VisuallyHidden,
  DialogTitle,
  DialogDescription,
} from 'reka-ui';
import UiButton from '@/components/ui/ui-button.vue';
import TagChip from '@/components/app/chips/tag-chip.vue';
import type { Tag } from '@/types/task';
import { Icon } from '@iconify/vue';

defineProps<{ open: boolean; tag?: Tag }>();
defineEmits<{ close: []; confirm: [] }>();
</script>

<template>
  <DialogRoot :open="open" @update:open="(val) => !val && $emit('close')">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-30 flex items-center justify-center bg-base-content-100/30"
      />
      <DialogContent
        class="max-w-xl px-4 z-50 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] -ml-[calc(var(--scrollbar-width)/2)]"
      >
        <div
          class="bg-base-100 rounded-2xl shadow-lg border-2 border-base-300 p-4 flex flex-col items-center"
        >
          <VisuallyHidden asChild>
            <DialogTitle>Supprimer ce tag ?</DialogTitle>
          </VisuallyHidden>
          <div v-if="tag" class="mb-4 w-full p-2 border-2 border-base-300 rounded-3xl bg-base-200">
            <div
              class="flex justify-center items-center gap-2 bg-base-100 p-2 rounded-2xl mx-auto w-full border-2 border-base-300"
            >
              <p class="text-sm font-medium">Ce tag sera retiré de toutes les tâches associées :</p>
              <TagChip :tag="tag" />
            </div>
          </div>
          <div class="flex flex-col sm:flex-row gap-6 w-full justify-between items-center">
            <div class="flex items-center gap-2">
              <Icon icon="ph:warning-circle" class="w-6 h-6 text-error flex-shrink-0" />
              <DialogDescription class="text-base-content-200 text-sm max-w-10/12">
                Êtes-vous sûr de vouloir supprimer ce tag ? Cette action est irréversible.
              </DialogDescription>
            </div>
            <div class="flex gap-3">
              <DialogClose as="button">
                <UiButton text="Annuler" variant="accent" />
              </DialogClose>
              <UiButton text="Supprimer" variant="ghost" @click="$emit('confirm')" />
            </div>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

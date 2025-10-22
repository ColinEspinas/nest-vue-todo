<script setup lang="ts">
import UiButton from '@/components/ui/ui-button.vue';
import type { Order } from '@/types/task';
import { Icon } from '@iconify/vue';
import {
  SelectContent,
  SelectItem,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectViewport,
} from 'reka-ui';
import { ref, computed } from 'vue';

type Directions = 'asc' | 'desc';
type Properties = 'created' | 'deadline' | 'priority';

const order = defineModel<Order>({ required: true });

const property = ref<Properties>(order.value.split('_')[0] as Properties);
const direction = ref<Directions>(order.value.split('_')[1] as Directions);

const propertiesDetails = [
  { value: 'created', label: 'Création', icon: 'ph:calendar-plus', color: 'text-base-content-100' },
  { value: 'deadline', label: 'Échéance', icon: 'ph:calendar-check', color: 'text-accent' },
  { value: 'priority', label: 'Priorité', icon: 'ph:flag-bold', color: 'text-error' },
] as const;

const directionsDetails = [
  { value: 'asc', label: 'Ascendant', icon: 'ph:arrow-up-bold' },
  { value: 'desc', label: 'Descendant', icon: 'ph:arrow-down-bold' },
] as const;

const currentPropertyDetails = computed(
  () => propertiesDetails.find((p) => p.value === property.value) || propertiesDetails[0],
);
const currentDirectionDetails = computed(
  () => directionsDetails.find((d) => d.value === direction.value) || directionsDetails[1],
);

const syncOrder = () => {
  order.value = `${property.value}_${direction.value}` as Order;
};

const handleDirectionToggle = () => {
  direction.value = direction.value === 'asc' ? 'desc' : 'asc';
  syncOrder();
};
</script>

<template>
  <div class="flex gap-2 items-center">
    <SelectRoot v-model="property" @update:model-value="syncOrder" modal>
      <SelectTrigger
        class="flex items-center justify-between gap-2 text-sm py-1.5 px-3 rounded-lg bg-base-100 text-base-content-100 border-2 border-base-content-100/20 ring-0 ring-base-content-100/10 hover:ring-3 focus:ring-3 transition-all outline-none cursor-pointer"
        aria-label="Sélectionner la propriété de tri"
      >
        <div class="flex items-center gap-2">
          <Icon
            :icon="currentPropertyDetails.icon"
            :class="[currentPropertyDetails.color]"
            size="18"
          />
          <span>{{ currentPropertyDetails.label }}</span>
        </div>
        <Icon
          icon="ph:caret-down-bold"
          class="w-4 h-4 text-base-content-300 transition-transform data-[state=open]:rotate-180"
        />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          class="bg-base-100 border-2 border-base-content-100/20 rounded-lg shadow-lg z-50 min-w-[var(--reka-select-trigger-width)] max-h-[200px] overflow-hidden"
          :side-offset="4"
          :collision-padding="8"
          :sticky="'always'"
          position="popper"
        >
          <SelectViewport>
            <SelectItem
              v-for="detail in propertiesDetails"
              :key="detail.value"
              :value="detail.value"
              class="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-base-200 focus:bg-base-200 outline-none data-[highlighted]:bg-base-200 transition-colors"
            >
              <Icon :icon="detail.icon" :class="[detail.color]" size="18" />
              <span>{{ detail.label }}</span>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
    <UiButton
      :aria-label="`Trier par ${currentPropertyDetails.label} (${currentDirectionDetails.label})`"
      @click="handleDirectionToggle"
      :before-icon="currentDirectionDetails.icon"
      variant="secondary"
      size="sm"
    >
    </UiButton>
  </div>
</template>

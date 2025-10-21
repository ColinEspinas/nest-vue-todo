<script setup lang="ts">
import {
  PaginationRoot,
  PaginationList,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from 'reka-ui';
import UiButton from '@/components/ui/ui-button.vue';
const props = defineProps<{
  limit: number;
  total: number;
}>();
const page = defineModel<number>('page');
</script>

<template>
  <PaginationRoot
    v-model:page="page"
    :items-per-page="props.limit"
    :total="props.total"
    :sibling-count="1"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1 text-base-content-100">
      <PaginationFirst asChild>
        <UiButton size="sm" variant="secondary" before-icon="ph:caret-double-left-bold" />
      </PaginationFirst>
      <PaginationPrev asChild>
        <UiButton size="sm" variant="secondary" before-icon="ph:caret-left-bold" />
      </PaginationPrev>
      <template v-for="(item, index) in items">
        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" asChild>
          <UiButton
            size="sm"
            :variant="page === item.value ? 'primary' : 'secondary'"
            :text="item.value.toString()"
            class="w-[35.2px] h-[35.2px]"
            align="center"
          />
        </PaginationListItem>
        <PaginationEllipsis
          v-else
          :key="item.type"
          :index="index"
          class="w-9 h-9 flex items-center justify-center"
        >
          &#8230;
        </PaginationEllipsis>
      </template>
      <PaginationNext asChild>
        <UiButton size="sm" variant="secondary" before-icon="ph:caret-right-bold" />
      </PaginationNext>
      <PaginationLast asChild>
        <UiButton size="sm" variant="secondary" before-icon="ph:caret-double-right-bold" />
      </PaginationLast>
    </PaginationList>
  </PaginationRoot>
</template>

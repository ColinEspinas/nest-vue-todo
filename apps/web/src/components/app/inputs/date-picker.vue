<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { CalendarDate, type DateValue } from '@internationalized/date';
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
} from 'reka-ui';
import UiButton from '../../ui/ui-button.vue';

interface Props {
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Sélectionner une date',
});

const selectedDate = defineModel<Date | null>();

const isOpen = ref(false);
const isMobile = ref(false);

onMounted(() => {
  isMobile.value =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;
});

const handleDateSelect = (date: DateValue | undefined) => {
  if (date && 'year' in date && 'month' in date && 'day' in date) {
    selectedDate.value = new Date(date.year, date.month - 1, date.day);
    isOpen.value = false;
  }
};

const buttonText = computed(() => {
  if (selectedDate.value) {
    return selectedDate.value.toLocaleDateString();
  }
  return props.placeholder;
});

const calendarValue = computed(() => {
  if (selectedDate.value) {
    return new CalendarDate(
      selectedDate.value.getFullYear(),
      selectedDate.value.getMonth() + 1,
      selectedDate.value.getDate(),
    );
  }
  return undefined;
});

const clearSelection = () => {
  selectedDate.value = null;
};

const selectToday = () => {
  selectedDate.value = new Date();
  isOpen.value = false;
};

const closePopover = () => {
  isOpen.value = false;
};

const isDateUnavailable = (date: DateValue) => {
  if (!('year' in date && 'month' in date && 'day' in date)) {
    return false;
  }
  const today = new Date();
  const todayCalendar = new CalendarDate(
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate(),
  );
  return (date as CalendarDate).compare(todayCalendar) < 0;
};

const nativeDateValue = computed(() => {
  if (!selectedDate.value) return '';
  return selectedDate.value.toISOString().split('T')[0];
});

const handleNativeDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.value) {
    selectedDate.value = new Date(target.value + 'T00:00:00');
  } else {
    selectedDate.value = null;
  }
};

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});
</script>

<template>
  <div v-if="isMobile">
    <input
      type="date"
      :value="nativeDateValue"
      :min="minDate"
      :placeholder="props.placeholder"
      class="text-sm py-2 px-3 rounded-lg bg-base-100 text-base-content-100 border-2 border-base-content-100/20 ring-0 ring-base-content-100/10 hover:ring-3 focus:ring-3 transition-all outline-none cursor-pointer font-medium"
      @change="handleNativeDateChange"
    />
  </div>
  <PopoverRoot v-else v-model:open="isOpen" modal>
    <PopoverTrigger asChild>
      <UiButton variant="secondary" :text="buttonText" before-icon="ph:calendar" />
    </PopoverTrigger>

    <PopoverContent
      class="bg-white border-2 border-base-300 rounded-2xl shadow-lg p-2 z-50"
      :side-offset="4"
      @interact-outside="closePopover"
      @focus-outside="closePopover"
      @escape-key-down="closePopover"
    >
      <CalendarRoot
        v-slot="{ weekDays, grid }"
        :model-value="calendarValue"
        @update:model-value="handleDateSelect"
        :is-date-unavailable="isDateUnavailable"
        fixed-weeks
      >
        <CalendarHeader class="flex items-center justify-between">
          <CalendarPrev asChild>
            <UiButton variant="ghost" size="sm" before-icon="radix-icons:chevron-left" />
          </CalendarPrev>
          <CalendarHeading class="text-sm text-base-content-100 font-medium" />

          <CalendarNext asChild>
            <UiButton variant="ghost" size="sm" before-icon="radix-icons:chevron-right" />
          </CalendarNext>
        </CalendarHeader>
        <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <CalendarGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="w-full border-collapse select-none space-y-1"
          >
            <CalendarGridHead>
              <CalendarGridRow class="mb-1 grid w-full grid-cols-7 gap-1.5">
                <CalendarHeadCell
                  v-for="day in weekDays"
                  :key="day"
                  class="rounded-md text-xs text-base-content-300 font-medium"
                >
                  {{ day }}
                </CalendarHeadCell>
              </CalendarGridRow>
            </CalendarGridHead>
            <CalendarGridBody class="grid gap-1.5">
              <CalendarGridRow
                v-for="(weekDates, index) in month.rows"
                :key="`weekDate-${index}`"
                class="grid grid-cols-7 gap-1.5"
              >
                <CalendarCell
                  v-for="weekDate in weekDates"
                  :key="weekDate.toString()"
                  :date="weekDate"
                  class="relative text-center text-sm"
                >
                  <CalendarCellTrigger
                    :day="weekDate"
                    :month="month.value"
                    class="relative flex items-center justify-center rounded-lg whitespace-nowrap text-sm font-medium w-8 h-8 outline-none transition-all not-disabled:active:scale-95 cursor-pointer bg-transparent text-base-content-100 ring-0 ring-base-content-100/10 hover:ring-3 border-2 border-base-content-100/20 data-[outside-view]:text-base-content-300 data-[highlighted]:ring-3 data-[unavailable]:pointer-events-none data-[unavailable]:text-base-content-300 data-[unavailable]:bg-base-200 data-[unavailable]:border-base-300 data-[today]:bg-base-content-100 data-[today]:text-base-100 data-[today]:ring-0 data-[today]:border-2 data-[today]:border-transparent data-[today]:ring-base-content-100/20 data-[today]:hover:ring-3 data-[selected]:!bg-accent data-[selected]:!text-accent-content data-[selected]:!ring-0 data-[selected]:!ring-accent/25 data-[selected]:hover:!ring-3 data-[selected]:!border-2 data-[selected]:!border-accent data-[selected]:!bg-radial-(--gradient-position) data-[selected]:!from-accent-content/20 data-[selected]:!to-transparent data-[selected]:!to-50%"
                  />
                </CalendarCell>
              </CalendarGridRow>
            </CalendarGridBody>
          </CalendarGrid>
        </div>

        <!-- Footer buttons -->
        <div class="flex gap-2 mt-3 pt-3 border-t-2 border-gray-200">
          <UiButton
            variant="ghost"
            size="sm"
            text="Effacer"
            @click="clearSelection"
            class="flex-1"
          />
          <UiButton
            variant="primary"
            size="sm"
            text="Aujourd'hui"
            @click="selectToday"
            class="flex-1"
          />
        </div>
      </CalendarRoot>
    </PopoverContent>
  </PopoverRoot>
</template>

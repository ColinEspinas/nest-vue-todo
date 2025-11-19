<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import UiButton from '@/components/ui/ui-button.vue';
import PrioritySelect from '@/components/app/inputs/priority-select.vue';
import DatePicker from '@/components/app/inputs/date-picker.vue';
import HashtagTagInput from '@/components/app/inputs/hashtag-tag-input.vue';
import TagBadges from '@/components/app/inputs/tag-badges.vue';
import { useFormValidation } from '@/composables/use-form-validation';
import { useHashtagTags } from '@/composables/use-hashtag-tags';
import { createTaskSchema } from '@/schemas';
import { useTagsStore } from '@/stores/tags';
import type { CreateTask } from '@/types/task';

defineProps<{ loading?: boolean }>();

const emit = defineEmits<{
  submit: [task: CreateTask, tagsToCreate: Array<{ name: string; color?: string }>];
}>();

const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);

const title = ref('');
const description = ref('');
const priority = ref<'high' | 'medium' | 'low'>('medium');
const deadline = ref<Date | null>(null);

const { getError, hasError, validate } = useFormValidation(createTaskSchema);

// Use hashtag tags composable
const {
  extractedTags,
  selectedTagIds,
  tagsToCreate,
  canAddMoreTags,
  tagDetectionEnabled,
  addTag,
  removeTag,
  clearTags,
  getTagColor,
  disableDetection,
  enableDetection,
} = useHashtagTags({
  availableTags: tags,
});

// Handle tag addition from space trigger
function handleTagAdded(tagName: string, hashtagStart: number, cursorPos: number) {
  if (addTag(tagName)) {
    // Remove the hashtag and space from the title
    title.value = title.value.slice(0, hashtagStart) + title.value.slice(cursorPos);
  }
}

// Handle tag selection from dropdown
function handleTagSelected(tagName: string, hashtagStart: number) {
  if (addTag(tagName)) {
    // Find where the hashtag ends
    const afterHashtag = title.value.slice(hashtagStart);
    const hashtagMatch = afterHashtag.match(/^#[\w-]*/);
    if (hashtagMatch) {
      const hashtagEnd = hashtagStart + hashtagMatch[0].length;
      title.value = title.value.slice(0, hashtagStart) + title.value.slice(hashtagEnd);
    }
  }
}

function resetForm() {
  title.value = '';
  description.value = '';
  priority.value = 'medium';
  deadline.value = null;
  clearTags();
}

async function handleSubmit() {
  const formData = {
    title: title.value.trim(),
    description: description.value.trim(),
    priority: priority.value,
    deadline: deadline.value || undefined,
    tagIds: selectedTagIds.value,
  };

  if (!validate(formData)) {
    return;
  }

  emit('submit', formData, tagsToCreate.value);
  resetForm();
}
</script>

<template>
  <form
    class="flex flex-col border-2 border-base-300 rounded-xl sm:rounded-2xl bg-base-100 overflow-hidden"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <div class="border-b-2 border-base-300">
      <label for="task-title" class="text-sm font-medium text-base-content-100 ml-3 mt-3 block">
        Titre
      </label>

      <HashtagTagInput
        id="task-title"
        v-model="title"
        :available-tags="tags"
        :extracted-tags="extractedTags"
        :can-add-more-tags="canAddMoreTags"
        :tag-detection-enabled="tagDetectionEnabled"
        :max-length="50"
        @tag-added="handleTagAdded"
        @tag-selected="handleTagSelected"
        @disable-detection="disableDetection"
        @enable-detection="enableDetection"
      />

      <TagBadges
        :tags="extractedTags"
        :max-tags="3"
        :get-tag-color="getTagColor"
        @remove-tag="removeTag"
      />

      <div class="flex justify-between items-center px-3 pb-3">
        <span class="text-xs text-base-content-300">{{ title.length }}/50 caractères</span>
        <span v-if="hasError('title')" class="text-xs text-error">{{ getError('title') }}</span>
      </div>
    </div>

    <div class="flex flex-col">
      <label for="task-description" class="text-sm font-medium text-base-content-100 ml-3 mt-3">
        Description
      </label>
      <textarea
        v-model="description"
        id="task-description"
        placeholder="Entrez la description de la tâche"
        maxlength="256"
        rows="4"
        autocomplete="off"
        class="py-2 px-3 outline-none resize-none h-24 text-sm"
      ></textarea>
      <div class="flex justify-between items-center px-3 pb-2">
        <span class="text-xs text-base-content-300"> {{ description.length }}/256 caractères </span>
        <span v-if="hasError('description')" class="text-xs text-error">
          {{ getError('description') }}
        </span>
      </div>
    </div>
    <div class="flex flex-col gap-3 p-3 bg-base-200/50">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <DatePicker v-model="deadline" placeholder="Pas d'échéance" />
          <PrioritySelect v-model="priority" />
        </div>
        <UiButton
          text="Ajouter aux tâches"
          variant="accent"
          type="submit"
          :loading="loading"
          :disabled="loading"
          after-icon="ph:arrow-bend-right-down-bold"
          class="w-full sm:w-auto"
        />
      </div>
    </div>
  </form>
</template>

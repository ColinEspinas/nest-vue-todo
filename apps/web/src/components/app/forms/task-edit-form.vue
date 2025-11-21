<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import PrioritySelect from '@/components/app/inputs/priority-select.vue';
import DatePicker from '@/components/app/inputs/date-picker.vue';
import HashtagTagInput from '@/components/app/inputs/hashtag-tag-input.vue';
import TagBadges from '@/components/app/inputs/tag-badges.vue';
import { useFormValidation } from '@/composables/use-form-validation';
import { useHashtagTags } from '@/composables/use-hashtag-tags';
import { createTaskSchema } from '@/schemas';
import { useTagsStore } from '@/stores/tags';
import type { UpdateTask, Tag } from '@/types/task';

const props = defineProps<{ loading?: boolean; task: UpdateTask & { tags?: Tag[] } }>();

const emit = defineEmits<{
  submit: [task: UpdateTask, tagsToCreate: Array<{ name: string; color?: string }>];
}>();

const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);

const { getError, hasError, validate } = useFormValidation(createTaskSchema);

const title = ref('');
const description = ref('');
const priority = ref<'high' | 'medium' | 'low'>('medium');
const deadline = ref<Date | null>(null);

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

const handleSubmit = async () => {
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
};

defineExpose({
  handleSubmit,
});

watch(
  () => props.task,
  (newTask) => {
    console.log('Task updated:', newTask);
    title.value = newTask.title || '';
    description.value = newTask.description || '';
    priority.value = newTask.priority || 'medium';
    deadline.value = newTask.deadline || null;
    clearTags();
    if (newTask.tags) {
      newTask.tags.forEach((tag) => addTag(tag.name));
    }
  },
  { immediate: true },
);
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
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <DatePicker v-model="deadline" placeholder="Pas d'échéance" />
        <PrioritySelect v-model="priority" />
      </div>
    </div>
  </form>
</template>

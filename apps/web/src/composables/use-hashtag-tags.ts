import { ref, computed, toValue } from 'vue';
import type { MaybeRefOrGetter } from 'vue';
import { getRandomTagColor, DEFAULT_TAG_COLOR } from '@/config/tag-colors';
import type { Tag } from '@/types/task';

export interface ExtractedTag {
  name: string;
  color?: string;
  isNew: boolean;
}

export interface HashtagTagsOptions {
  availableTags: MaybeRefOrGetter<Tag[]>;
  maxTags?: number;
  maxTagLength?: number;
}

export function useHashtagTags(options: HashtagTagsOptions) {
  const { availableTags, maxTags = 3, maxTagLength = 25 } = options;

  const extractedTags = ref<ExtractedTag[]>([]);
  const tagDetectionEnabled = ref(true);

  const selectedTagIds = computed(() => {
    return extractedTags.value
      .map((tag) => {
        const existing = toValue(availableTags).find(
          (t) => t.name.toLowerCase() === tag.name.toLowerCase(),
        );
        return existing?.id;
      })
      .filter((id): id is string => id !== undefined);
  });

  const tagsToCreate = computed(() => {
    return extractedTags.value
      .filter((tag) => {
        return !toValue(availableTags).some((t) => t.name.toLowerCase() === tag.name.toLowerCase());
      })
      .map((tag) => ({ name: tag.name, color: tag.color }));
  });

  const canAddMoreTags = computed(() => extractedTags.value.length < maxTags);

  function addTag(tagName: string) {
    if (extractedTags.value.length >= maxTags) return false;
    if (tagName.length > maxTagLength) return false;

    const existingTag = toValue(availableTags).find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase(),
    );

    const alreadyAdded = extractedTags.value.some(
      (t) => t.name.toLowerCase() === tagName.toLowerCase(),
    );

    if (alreadyAdded) return false;

    if (existingTag) {
      extractedTags.value.push({
        name: existingTag.name,
        color: existingTag.color || undefined,
        isNew: false,
      });
    } else {
      extractedTags.value.push({
        name: tagName,
        color: getRandomTagColor(),
        isNew: true,
      });
    }

    return true;
  }

  function removeTag(tagName: string) {
    extractedTags.value = extractedTags.value.filter((t) => t.name !== tagName);
  }

  function clearTags() {
    extractedTags.value = [];
  }

  function getTagColor(tag: ExtractedTag) {
    return tag.color || DEFAULT_TAG_COLOR;
  }

  function disableDetection() {
    tagDetectionEnabled.value = false;
  }

  function enableDetection() {
    tagDetectionEnabled.value = true;
  }

  return {
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
  };
}

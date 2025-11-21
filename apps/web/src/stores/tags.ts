import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useTagsApi, type CreateTag, type UpdateTag } from '@/composables/api/use-tags-api';
import type { Tag } from '@/types/task';

export const useTagsStore = defineStore('tags', () => {
  const api = useTagsApi();

  const tags = ref<Tag[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const findTagById = (id: string): Tag | undefined => tags.value.find((tag) => tag.id === id);

  const replaceTag = (updatedTag: Tag) => {
    const index = tags.value.findIndex((tag) => tag.id === updatedTag.id);
    if (index !== -1) {
      tags.value[index] = updatedTag;
    }
  };

  const sortTags = () => {
    tags.value.sort((a, b) => a.name.localeCompare(b.name));
  };

  const fetchTags = async () => {
    loading.value = true;
    error.value = null;

    const { data, error: apiError } = await api.getTags();
    if (apiError.value) {
      error.value = 'Échec du chargement des tags';
      loading.value = false;
      return;
    }

    tags.value = data.value || [];
    sortTags();
    loading.value = false;
  };

  const createTag = async (tag: CreateTag) => {
    error.value = null;

    const { data, error: apiError } = await api.createTag(tag);
    if (apiError.value) {
      error.value = 'Échec de la création du tag';
      return;
    }

    if (data.value) {
      tags.value.push(data.value);
      sortTags();
    }

    return data.value;
  };

  const createTags = async (tagsToCreate: CreateTag[]) => {
    error.value = null;

    const { data, error: apiError } = await api.createTags(tagsToCreate);
    if (apiError.value) {
      error.value = 'Échec de la création des tags';
      return [];
    }

    if (data.value) {
      tags.value.push(...data.value);
      sortTags();
      return data.value;
    }

    return [];
  };

  const updateTag = async (id: string, tag: UpdateTag) => {
    error.value = null;

    const originalTag = findTagById(id);
    if (originalTag) {
      replaceTag({ ...originalTag, ...tag } as Tag);
    }

    const { data, error: apiError } = await api.updateTag(id, tag);
    if (apiError.value) {
      error.value = 'Échec de la mise à jour du tag';
      if (originalTag) {
        replaceTag(originalTag);
      }
      return;
    }

    // Re-sort if name was updated
    if (tag.name) {
      sortTags();
    }

    return data.value;
  };

  const deleteTag = async (id: string) => {
    error.value = null;

    const deletedTag = findTagById(id);
    const originalIndex = tags.value.findIndex((tag) => tag.id === id);
    tags.value = tags.value.filter((tag) => tag.id !== id);

    const { data, error: apiError } = await api.deleteTag(id);
    if (apiError.value) {
      error.value = 'Échec de la suppression du tag';
      if (deletedTag && originalIndex !== -1) {
        tags.value.splice(originalIndex, 0, deletedTag);
      }
      return;
    }

    return data.value;
  };

  const clearError = () => {
    error.value = null;
  };

  const clearTags = () => {
    tags.value = [];
  };

  return {
    tags,
    loading,
    error,
    fetchTags,
    createTag,
    createTags,
    updateTag,
    deleteTag,
    findTagById,
    clearError,
    clearTags,
  };
});

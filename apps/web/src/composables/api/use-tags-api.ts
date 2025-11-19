import type { Tag } from '@/types/task';
import { useApi } from './use-api';

export interface CreateTag {
  name: string;
  color?: string;
}

export interface UpdateTag {
  name?: string;
  color?: string;
}

export const useTagsApi = () => {
  const getTags = async () => {
    return useApi('/tags').json<Tag[]>();
  };

  const getTag = async (id: string) => {
    return useApi(`/tags/${id}`).json<Tag>();
  };

  const createTag = async (tag: CreateTag) => {
    return useApi('/tags', {
      method: 'POST',
      body: JSON.stringify(tag),
    }).json<Tag>();
  };

  const createTags = async (tags: CreateTag[]) => {
    return useApi('/tags', {
      method: 'POST',
      body: JSON.stringify({ tags }),
    }).json<Tag[]>();
  };

  const updateTag = async (id: string, updates: UpdateTag) => {
    return useApi(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }).json<Tag>();
  };

  const deleteTag = async (id: string) => {
    return useApi(`/tags/${id}`, {
      method: 'DELETE',
    }).json<Tag>();
  };

  return {
    getTags,
    getTag,
    createTag,
    createTags,
    updateTag,
    deleteTag,
  };
};

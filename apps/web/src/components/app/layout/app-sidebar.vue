<script setup lang="ts">
import { ref, useTemplateRef, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { useTagsStore } from '@/stores/tags';
import { DEFAULT_TAG_COLOR, getRandomTagColor } from '@/config/tag-colors';
import UiButton from '../../ui/ui-button.vue';
import AppLogo from './app-logo.vue';
import Avatar from 'vue-boring-avatars';
import { Icon } from '@iconify/vue';

const { t } = useI18n();
const router = useRouter();
const { logout } = useAuthStore();
const { isAuthenticated, user } = storeToRefs(useAuthStore());
const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);

const logoutHandler = () => {
  logout();
  router.push({ name: 'landing' });
};

// Inline tag creation
const isCreatingTag = ref(false);

const tagNameMaxLength = 32;
const newTagName = ref('');
const newTagColor = ref('');
const newTagInputRef = useTemplateRef<HTMLInputElement>('newTagInput');

/**
 * Starts creating a new tag inline
 */
const startCreatingTag = async () => {
  isCreatingTag.value = true;
  newTagName.value = '';
  newTagColor.value = getRandomTagColor();
  await nextTick();
  newTagInputRef.value?.focus();
};

/**
 * Handles input to replace spaces with hyphens
 */
const handleTagNameInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let normalizedValue = target.value.replace(/\s+/g, '-');
  if (normalizedValue.length > tagNameMaxLength) {
    normalizedValue = normalizedValue.slice(0, tagNameMaxLength);
  }
  if (target.value !== normalizedValue) {
    target.value = normalizedValue;
  }
  newTagName.value = normalizedValue;
};

/**
 * Saves the new tag
 */
const saveNewTag = async () => {
  const trimmedName = newTagName.value.trim().replace(/\s+/g, '-');
  if (!trimmedName) {
    cancelCreatingTag();
    return;
  }

  const newTag = await tagsStore.createTag({
    name: trimmedName,
    color: newTagColor.value,
  });

  if (newTag) {
    router.push(`/tags/${newTag.id}`);
  }

  cancelCreatingTag();
};

/**
 * Cancels tag creation
 */
const cancelCreatingTag = () => {
  isCreatingTag.value = false;
  newTagName.value = '';
  newTagColor.value = '';
};

// Fetch tags when authenticated
watch(
  isAuthenticated,
  (newValue) => {
    if (newValue) {
      tagsStore.fetchTags();
    } else {
      tagsStore.clearTags();
    }
  },
  { immediate: true },
);
</script>

<template>
  <aside
    class="flex flex-col overflow-hidden w-64 bg-base-200/50 rounded-3xl border-2 border-base-content-100/10"
  >
    <!-- Logo/Brand -->
    <div
      class="flex items-center justify-center gap-2 font-medium p-4 bg-base-100 border-b-2 border-base-content-100/10 flex-shrink-0"
    >
      <AppLogo variant="md" />
    </div>

    <!-- Scrollable Navigation -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
      <nav class="flex flex-col gap-4 px-2 py-4" v-if="isAuthenticated">
        <!-- Main Links -->
        <div class="flex flex-col gap-1">
          <RouterLink
            to="/tasks"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium hover:bg-base-content-100/5"
            active-class="bg-base-content-100/5"
          >
            <Icon icon="ph:list-checks-bold" class="w-5 h-5" />
            <span>{{ t('nav.tasks') }}</span>
          </RouterLink>
        </div>

        <!-- Tags Group -->
        <div class="flex flex-col gap-2">
          <p class="text-xs font-semibold text-base-content/60 px-3 uppercase tracking-wider">
            {{ t('nav.tags') }}
          </p>
          <div class="flex flex-col">
            <RouterLink
              v-for="tag in tags"
              :key="tag.id"
              :to="`/tags/${tag.id}`"
              class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium hover:bg-base-content-100/5"
              active-class="bg-base-content-100/5"
            >
              <div
                class="flex items-center justify-center w-6 h-6 rounded-lg border"
                :style="{
                  backgroundColor: `${tag.color || DEFAULT_TAG_COLOR}20`,
                  borderColor: tag.color || DEFAULT_TAG_COLOR,
                }"
              >
                <Icon
                  icon="ph:hash-bold"
                  class="w-3 h-3"
                  :style="{ color: tag.color || DEFAULT_TAG_COLOR }"
                />
              </div>
              <span class="truncate">{{ tag.name }}</span>
            </RouterLink>

            <!-- Inline tag creation -->
            <div
              v-if="isCreatingTag"
              class="flex items-center gap-3 px-3 py-2 rounded-lg bg-base-content-100/5 font-medium"
            >
              <div
                class="flex items-center justify-center w-6 h-6 rounded-lg border flex-shrink-0"
                :style="{
                  backgroundColor: `${newTagColor}20`,
                  borderColor: newTagColor,
                }"
              >
                <Icon icon="ph:hash-bold" class="w-3 h-3" :style="{ color: newTagColor }" />
              </div>
              <input
                ref="newTagInput"
                v-model="newTagName"
                @input="handleTagNameInput"
                @keyup.enter="saveNewTag"
                @keyup.escape="cancelCreatingTag"
                @blur="saveNewTag"
                :placeholder="t('tags.tagNamePlaceholder')"
                :maxlength="tagNameMaxLength"
                class="flex-1 bg-transparent outline-none min-w-0 placeholder:text-base-content-100/60"
              />
            </div>

            <!-- Add tag button -->
            <button
              v-else
              @click="startCreatingTag"
              class="flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer hover:bg-base-content-100/5"
            >
              <div
                class="flex items-center justify-center w-6 h-6 rounded-lg border border-dashed border-base-content-100/30 flex-shrink-0"
              >
                <Icon icon="ph:plus-bold" class="w-3 h-3 text-base-content-100/60" />
              </div>
              <span class="truncate text-base-content-100/60">{{ t('tags.addTag') }}</span>
            </button>
          </div>
        </div>
      </nav>
    </div>

    <!-- Settings Section -->
    <div v-if="isAuthenticated" class="flex flex-col gap-1 px-2 py-3 flex-shrink-0">
      <RouterLink
        to="/settings"
        class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-base-content/60 hover:text-base-content hover:bg-base-content-100/5 text-base-content-100/60"
        active-class="!text-base-content bg-base-content-100/5"
      >
        <Icon icon="ph:gear-bold" class="w-5 h-5" />
        <span>{{ t('nav.settings') }}</span>
      </RouterLink>
    </div>

    <!-- User Profile / Auth Section -->
    <div
      class="flex flex-col gap-3 p-4 bg-base-100 border-t-2 border-base-content-100/10 flex-shrink-0"
    >
      <template v-if="isAuthenticated && user">
        <div class="flex gap-2 items-center">
          <Avatar :name="user?.email || 'User'" :size="34" variant="marble" />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-sm truncate">{{ user.name }}</p>
            <p class="text-xs text-base-content/70 truncate">{{ user.email }}</p>
          </div>
          <UiButton
            @click="logoutHandler"
            variant="ghost"
            before-icon="ph:sign-out-bold"
            size="sm"
            shape="default"
          />
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col gap-2">
          <UiButton :text="t('nav.signIn')" to="/sign-in" variant="secondary" class="w-full" />
          <UiButton :text="t('nav.signUp')" to="/sign-up" variant="accent" class="w-full" />
        </div>
      </template>
    </div>
  </aside>
</template>

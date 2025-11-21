<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useTagsStore } from '@/stores/tags';
import { DEFAULT_TAG_COLOR } from '@/config/tag-colors';
import UiButton from '../ui/ui-button.vue';
import Avatar from 'vue-boring-avatars';
import { Icon } from '@iconify/vue';

const router = useRouter();
const { logout } = useAuthStore();
const { isAuthenticated, user } = storeToRefs(useAuthStore());
const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);

const logoutHandler = () => {
  logout();
  router.push({ name: 'landing' });
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
    class="flex flex-col justify-between overflow-hidden w-64 bg-base-200/50 rounded-3xl border-2 border-base-content-100/10"
  >
    <div class="flex flex-col gap-4 p-2">
      <!-- Logo/Brand -->
      <div class="flex items-center justify-center gap-2 font-medium pr-2 py-2">
        <div class="flex items-center justify-center p-1 rounded-lg bg-accent/20">
          <Icon icon="ph:checks-bold" class="w-4 h-4 text-accent" />
        </div>
        <p class="text-lg font-bold">Checkmate</p>
      </div>
      <!-- Navigation Links -->
      <nav class="flex flex-col gap-4" v-if="isAuthenticated">
        <!-- Main Links -->
        <div class="flex flex-col gap-1">
          <RouterLink
            to="/tasks"
            class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors font-medium"
            active-class="bg-base-content-100/5"
          >
            <Icon icon="ph:list-checks-bold" class="w-5 h-5" />
            <span>Tasks</span>
          </RouterLink>
        </div>

        <!-- Tags Group -->
        <div class="flex flex-col gap-2">
          <p class="text-xs font-semibold text-base-content/60 px-3 uppercase tracking-wider">
            Tags
          </p>
          <div class="flex flex-col">
            <RouterLink
              v-for="tag in tags"
              :key="tag.id"
              :to="`/tags/${tag.id}`"
              class="flex items-center gap-3 px-3 py-2 rounded-lg border-2 border-transparent transition-colors font-medium"
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
          </div>
        </div>
      </nav>
    </div>

    <!-- User Profile / Auth Section -->
    <div class="flex flex-col gap-3 p-4 bg-base-100 border-t-2 border-base-content-100/10">
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
          <UiButton text="Sign In" to="/sign-in" variant="secondary" class="w-full" />
          <UiButton text="Sign Up" to="/sign-up" variant="accent" class="w-full" />
        </div>
      </template>
    </div>
  </aside>
</template>

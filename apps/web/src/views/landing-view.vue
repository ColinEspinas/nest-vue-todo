<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import TaskItem from '@/components/app/tasks/task-item.vue';
import FeatureCard from '@/components/landing/feature-card.vue';
import UiButton from '@/components/ui/ui-button.vue';
import type { Task } from '@/types/task';
import { reactive } from 'vue';

const { t } = useI18n();

const marketingTask = reactive<Task>({
  userId: 'fake',
  id: '1',
  title: t('app.landing.marketingTask.title'),
  description: t('app.landing.marketingTask.description'),
  priority: 'high',
  createdAt: new Date(),
  updatedAt: new Date(),
  completed: false,
  tags: [],
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <div class="flex flex-col bg-base-100 p-6 rounded-2xl border-2 border-base-300">
        <h1 class="text-4xl font-medium text-center text-base-content-100 mb-4">
          {{ t('app.landing.headline') }}
        </h1>
        <p class="text-center text-base-content-200 mb-6">
          {{ t('app.landing.subheadline') }}
        </p>
        <UiButton
          :text="t('app.landing.cta')"
          to="/sign-up"
          variant="accent"
          class="mx-auto block"
        />

        <TaskItem class="mt-8" :task="marketingTask" hide-actions disabled-checkbox />
      </div>
    </section>

    <section class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <div class="grid grid-cols-2 grid-rows-2 gap-4">
        <FeatureCard
          :title="t('app.landing.features.simple.title')"
          :description="t('app.landing.features.simple.description')"
        />
        <FeatureCard
          :title="t('app.landing.features.priorities.title')"
          :description="t('app.landing.features.priorities.description')"
        />
        <FeatureCard
          :title="t('app.landing.features.deadlines.title')"
          :description="t('app.landing.features.deadlines.description')"
        />
        <FeatureCard
          :title="t('app.landing.features.openSource.title')"
          :description="t('app.landing.features.openSource.description')"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import TaskItem from '@/components/app/tasks/task-item.vue';
import FeatureCard from '@/components/landing/feature-card.vue';
import UiButton from '@/components/ui/ui-button.vue';
import type { Task } from '@/types/task';
import { reactive } from 'vue';

const marketingTask = reactive<Task>({
  userId: 'fake',
  id: '1',
  title: "S'inscrire sur Checkmate",
  description: 'Créez un compte pour commencer à organiser mes tâches et atteindre mes objectifs.',
  priority: 'high',
  createdAt: new Date(),
  updatedAt: new Date(),
  deadline: null,
  completed: false,
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="bg-base-200/50 p-4 rounded-3xl border-2 border-base-content-100/10">
      <div class="flex flex-col bg-base-100 p-6 rounded-2xl border-2 border-base-300">
        <h1 class="text-4xl font-medium text-center text-base-content-100 mb-4">
          Plannifiez et accomplissez vos objectifs, simplement.
        </h1>
        <p class="text-center text-base-content-200 mb-6">
          Avec Checkmate, pas de tableaux compliqués, simplement vos tâches et vous.
        </p>
        <UiButton
          text="Commencer maintenant"
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
          title="Simple"
          description="Gestion simplifiée des tâches pour une productivité maximale."
        />
        <FeatureCard
          title="Priorités"
          description="Organisez vos tâches selon leur importance et urgence."
        />
        <FeatureCard
          title="Échéances"
          description="Ne manquez jamais une date limite importante."
        />
        <FeatureCard
          title="Open source"
          description="La transparence avant tout, notre code est ouvert à tous."
        />
      </div>
    </section>
  </div>
</template>

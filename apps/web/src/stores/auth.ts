import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useAuthApi, type UpdateUser } from '@/composables/api/use-auth-api';
import type { EnrichedUser, NewUser } from '@/types/user';

export const useAuthStore = defineStore('auth', () => {
  const api = useAuthApi();

  const token = useLocalStorage<string | null>('token', null);
  const user = ref<EnrichedUser | null>(null);
  const loading = ref(false);

  const totalTasksStat = ref(0);
  const completedTasksStat = ref(0);
  const pendingTasksStat = computed(() => totalTasksStat.value - completedTasksStat.value);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  const login = async (email: string, password: string) => {
    const { data, error } = await api.login(email, password);

    if (error.value) {
      if (error.value === 'Unauthorized') {
        throw new Error('Email ou mot de passe invalide.');
      }
    }

    token.value = data.value?.token || null;

    await restore();
  };

  const register = async (newUser: NewUser) => {
    const { data, error } = await api.register(newUser);

    if (error.value) {
      if (error.value === 'Conflict') {
        throw new Error('Un utilisateur avec cet e-mail existe déjà.');
      }
    }

    token.value = data.value?.token || null;

    await restore();
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  const restore = async () => {
    if (!token.value) return;
    loading.value = true;
    try {
      const { data } = await api.getCurrentUser();
      user.value = data.value ?? null;
      totalTasksStat.value = user.value?.totalTasks || 0;
      completedTasksStat.value = user.value?.completedTasks || 0;
    } catch {
      logout();
    }
    loading.value = false;
  };

  const updateProfile = async (updateData: UpdateUser) => {
    loading.value = true;
    try {
      const { data, error } = await api.updateCurrentUser(updateData);

      if (error.value) {
        if (error.value === 'Conflict') {
          throw new Error('Un utilisateur avec cet e-mail existe déjà.');
        }
        throw new Error('Une erreur est survenue lors de la mise à jour du profil.');
      }

      user.value = data.value ?? null;
      totalTasksStat.value = user.value?.totalTasks || 0;
      completedTasksStat.value = user.value?.completedTasks || 0;
    } finally {
      loading.value = false;
    }
  };

  return {
    token,
    user,
    loading,
    totalTasksStat,
    completedTasksStat,
    pendingTasksStat,
    isAuthenticated,
    login,
    register,
    logout,
    restore,
    updateProfile,
  };
});

import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { useAuthApi } from '@/composables/api/use-auth-api';
import type { NewUser, User } from '@/types/user';

export const useAuthStore = defineStore('auth', () => {
  const api = useAuthApi();

  const token = useLocalStorage<string | null>('token', null);
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (email: string, password: string) => {
    const { data, error } = await api.login(email, password);

    if (error.value) {
      throw new Error(error.value.message || 'Sign in failed');
    }

    token.value = data.value?.token || null;
    user.value = data.value?.user || null;
  };

  const register = async (newUser: NewUser) => {
    const { data, error } = await api.register(newUser);

    if (error.value) {
      throw new Error(error.value.message || 'Sign up failed');
    }

    token.value = data.value?.token || null;
    user.value = data.value?.user || null;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  const fetchCurrentUser = async () => {
    if (!token.value) return;

    const { data, error } = await api.getCurrentUser();

    if (error.value) {
      logout();
      return;
    }

    user.value = data.value || null;
  };

  watch(token, (newToken) => {
    if (!newToken) user.value = null;
    else fetchCurrentUser();
  });

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
  };
});

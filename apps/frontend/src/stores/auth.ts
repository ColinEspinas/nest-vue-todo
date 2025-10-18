import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authApi } from '../api/auth';
import type { User } from '../types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));

  const isAuthenticated = computed(() => !!token.value);

  async function register(email: string, password: string, name?: string) {
    try {
      const response = await authApi.register(email, password, name);
      token.value = response.access_token;
      user.value = response.user;
      localStorage.setItem('token', response.access_token);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async function login(email: string, password: string) {
    try {
      const response = await authApi.login(email, password);
      token.value = response.access_token;
      user.value = response.user;
      localStorage.setItem('token', response.access_token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  }

  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
  };
});

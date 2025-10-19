import { createFetch, useLocalStorage } from '@vueuse/core';

export const useApi = createFetch({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  options: {
    async beforeFetch({ options }) {
      const token = useLocalStorage('token', null).value;
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return { options };
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
});

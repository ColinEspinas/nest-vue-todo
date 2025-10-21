import type { EnrichedUser, NewUser, User } from '@/types/user';
import { useApi } from './use-api';

export const useAuthApi = () => {
  const login = async (email: string, password: string) => {
    return useApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }).json<{ token: string; user: User }>();
  };

  const register = async (newUser: NewUser) => {
    return useApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(newUser),
    }).json<{ token: string; user: User }>();
  };

  const getCurrentUser = async () => {
    return useApi('/auth/me').json<EnrichedUser>();
  };

  return {
    login,
    register,
    getCurrentUser,
  };
};

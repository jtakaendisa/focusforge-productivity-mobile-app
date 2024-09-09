import { router } from 'expo-router';
import { useAuthStore } from '../store';
import { signOutAuthUser } from '../services/auth';

export const useAuth = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  const signOut = async () => {
    try {
      await signOutAuthUser();
      setAuthUser(null);
      router.replace('/(auth)');
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return { authUser, signOut };
};

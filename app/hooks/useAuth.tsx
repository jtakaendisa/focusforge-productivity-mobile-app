import { router } from 'expo-router';
import { useAuthStore } from '../store';
import {
  authStateChangeListener,
  formatAuthUserData,
  signOutAuthUser,
} from '../services/auth';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';

export const useAuth = () => {
  const [loadedAuth, setLoadedAuth] = useState(false);

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

  useEffect(() => {
    const unsubscribe = authStateChangeListener(async (user: User) => {
      try {
        if (user) {
          const formattedAuthUser = await formatAuthUserData(user);
          setAuthUser(formattedAuthUser);
        }
        setLoadedAuth(true);
      } catch (error) {
        setAuthUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return { loadedAuth, authUser, signOut };
};

import { useEffect } from 'react';
import { authStateChangeListener, formatAuthUserData } from '@/app/services/auth';
import { User } from 'firebase/auth';

import { useAuthStore } from '@/app/store';

const Auth = () => {
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  useEffect(() => {
    const unsubscribe = authStateChangeListener(async (user: User) => {
      try {
        const formattedAuthUser = await formatAuthUserData(user);
        setAuthUser(formattedAuthUser);
      } catch (error) {
        setAuthUser(null);
      }
    });

    return unsubscribe;
  }, []);

  return null;
};

export default Auth;

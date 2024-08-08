import { useEffect, useState } from 'react';
import { Redirect, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuthStore } from '../store';

export default function AuthLayout() {
  const authUser = useAuthStore((s) => s.authUser);

  const [fetchedStatus, setFetchedStatus] = useState(false);
  const [onboarded, setOnboarded] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('onboarded');

        if (value !== null) {
          setOnboarded(JSON.parse(value));
        } else {
          setOnboarded(false);
        }
      } catch (e) {
        console.log('error', e);
      } finally {
        setFetchedStatus(true);
      }
    };

    getData();
  }, []);

  if (authUser) return <Redirect href="/(drawer)/(tabs)" />;

  if (!fetchedStatus) return null;

  return onboarded ? <AuthLayoutNav /> : <Redirect href="/onboarding" />;
}

function AuthLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}

import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '../store';
import useOnboardingStatus from '../hooks/useOnboardingStatus';

export default function AuthLayout() {
  const authUser = useAuthStore((s) => s.authUser);

  const { fetchedStatus, onboarded } = useOnboardingStatus();

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

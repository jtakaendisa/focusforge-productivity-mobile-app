import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '../store';

export default function AuthLayout() {
  const authUser = useAuthStore((s) => s.authUser);

  if (authUser) {
    return <Redirect href="/(tabs)" />;
  }

  return <AuthLayoutNav />;
}

function AuthLayoutNav() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}

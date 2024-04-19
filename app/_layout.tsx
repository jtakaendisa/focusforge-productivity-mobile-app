import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { User } from 'firebase/auth';
import { TamaguiProvider } from 'tamagui';

import { useAuthStore } from './store';
import config from '../tamagui.config';
import { authStateChangeListener, formatAuthUserData } from './services/auth';

interface RootLayoutNavProps {
  onboarded: boolean;
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  const [onboarded, setOnboarded] = useState(false);
  const [loadedAuth, setLoadedAuth] = useState(false);

  const [loadedFonts, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterLight: require('@tamagui/font-inter/otf/Inter-Light.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('onboarded');

        if (value !== null) {
          setOnboarded(JSON.parse(value));
        }
      } catch (e) {
        console.log('error', e);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (loadedFonts && loadedAuth) {
      SplashScreen.hideAsync();
    }
  }, [loadedFonts, loadedAuth]);

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

  if (!loadedFonts || !loadedAuth) {
    return null;
  }

  return <RootLayoutNav onboarded={onboarded} />;
}

function RootLayoutNav({ onboarded }: RootLayoutNavProps) {
  return (
    <TamaguiProvider config={config}>
      <Stack
        initialRouteName={onboarded ? '(auth)' : 'onboarding'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </TamaguiProvider>
  );
}

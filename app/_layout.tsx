import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { User } from 'firebase/auth';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TamaguiProvider } from 'tamagui';

import { useAuthStore } from './store';
import { authStateChangeListener, formatAuthUserData } from './services/auth';
import config from '../tamagui.config';

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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <TamaguiProvider config={config}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="newHabit" options={{ presentation: 'modal' }} />
            <Stack.Screen name="newTask" options={{ presentation: 'modal' }} />
            <Stack.Screen name="habitDetails" options={{ presentation: 'modal' }} />
            <Stack.Screen name="taskDetails" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}

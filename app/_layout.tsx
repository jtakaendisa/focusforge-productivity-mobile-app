import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getTokenValue, TamaguiProvider, View } from 'tamagui';

import { LogBox } from 'react-native';
import config from '../tamagui.config';
import { authStateChangeListener, formatAuthUserData } from './services/auth';
import { useActivityStore, useAuthStore } from './store';
import { Activity, CompletionDatesMap } from './entities';
import { isLastDayOfMonth } from 'date-fns';
import {
  getCompletionDatesFromStorage,
  getLastUpdateDate,
  setCompletionDatesInStorage,
  setLastUpdateDate,
  updateCompletionDatesForRecurringActivities,
} from './utils';

LogBox.ignoreAllLogs(true); // Ignore all logs (warnings and errors)

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
  const activities = useActivityStore((s) => s.activities);
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  const [loadedAuth, setLoadedAuth] = useState(false);
  const [completionDatesMap, setCompletionDatesMap] =
    useState<CompletionDatesMap | null>(null);
  const [loadedCompletionDates, setLoadedCompletionDates] = useState(false);

  const [loadedFonts, error] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterLight: require('@tamagui/font-inter/otf/Inter-Light.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loadedFonts && loadedAuth && loadedCompletionDates) {
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

  useEffect(() => {
    const fetchCompletionDatesMap = async () => {
      const completionDatesMap = await getCompletionDatesFromStorage();
      setCompletionDatesMap(completionDatesMap);
    };
    fetchCompletionDatesMap();
  }, []);

  useEffect(() => {
    const handleCompletionDatesUpdate = async (
      activities: Activity[],
      completionDatesMap: CompletionDatesMap
    ) => {
      const lastUpdateDate = await getLastUpdateDate();
      const currentDate = new Date();

      if (
        isLastDayOfMonth(currentDate) &&
        (!lastUpdateDate || lastUpdateDate < currentDate)
      ) {
        const updatedCompletionDatesMap =
          await updateCompletionDatesForRecurringActivities(
            activities,
            completionDatesMap
          );
        await setCompletionDatesInStorage(updatedCompletionDatesMap);
        await setLastUpdateDate(currentDate);
      }
      setLoadedCompletionDates(true);
    };

    if (activities && completionDatesMap) {
      handleCompletionDatesUpdate(activities, completionDatesMap);
    }
  }, [activities, completionDatesMap]);

  if (!loadedFonts || !loadedAuth || !loadedCompletionDates) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const customBlack1 = getTokenValue('$customBlack1');

  return (
    <TamaguiProvider config={config}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: customBlack1 }}>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: customBlack1 },
              }}
            >
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(drawer)" />
              <Stack.Screen name="newHabit" options={{ presentation: 'modal' }} />
              <Stack.Screen name="newTask" options={{ presentation: 'modal' }} />
              <Stack.Screen name="habitDetails" options={{ presentation: 'modal' }} />
              <Stack.Screen name="taskDetails" options={{ presentation: 'modal' }} />
            </Stack>
            <StatusBar style="light" />
          </BottomSheetModalProvider>
        </View>
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}

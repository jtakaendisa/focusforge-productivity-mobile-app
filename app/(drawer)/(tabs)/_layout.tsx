import { Redirect, Tabs, usePathname } from 'expo-router';
import { getTokenValue } from 'tamagui';

import CustomHeader from '@/app/components/tabs/CustomHeader';
import CustomTabBarButton from '../../components/tabs/CustomTabBarButton';
import { SCREEN_HEIGHT } from '../../constants';
import { useActivityStore, useAuthStore, useSearchStore } from '../../store';
import { TabRoute } from '@/app/entities';
import { getCompletionDatesFromStorage } from '@/app/utils';

const TabLayout = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const authUser = useAuthStore((s) => s.authUser);
  const setisSearchBarOpen = useSearchStore((s) => s.setIsSearchBarOpen);
  const setCompletionDatesMap = useActivityStore((s) => s.setCompletionDatesMap);

  const customGray3 = getTokenValue('$customGray3');

  const fetchCompletionDatesMap = async () => {
    const completionDatesMap = await getCompletionDatesFromStorage();
    setCompletionDatesMap(completionDatesMap);
  };

  const handleSearchBarClose = () => setisSearchBarOpen(false);

  const handleTabPress = () => {
    if (pathname === 'home' || pathname === 'habits') {
      fetchCompletionDatesMap();
    }
    handleSearchBarClose();
  };

  if (!authUser) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        header: ({ options: { title } }) => <CustomHeader title={title} />,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: SCREEN_HEIGHT / 12,
          backgroundColor: customGray3,
          borderTopWidth: 0,
        },
        tabBarButton: CustomTabBarButton,
      }}
      screenListeners={{
        tabPress: handleTabPress,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: 'Habits',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          headerShown: false,
          title: 'Timer',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

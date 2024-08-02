import { Redirect, Tabs } from 'expo-router';
import { getTokenValue } from 'tamagui';

import CustomHeader from '@/app/components/tabs/CustomHeader';
import CustomTabBarButton from '../../components/tabs/CustomTabBarButton';
import { SCREEN_HEIGHT } from '../../constants';
import { useAuthStore, useSearchStore } from '../../store';

const TabLayout = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const setisSearchBarOpen = useSearchStore((s) => s.setIsSearchBarOpen);

  const customGray3 = getTokenValue('$customGray3');

  const handleSearchBarClose = () => setisSearchBarOpen(false);

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
        tabPress: handleSearchBarClose,
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

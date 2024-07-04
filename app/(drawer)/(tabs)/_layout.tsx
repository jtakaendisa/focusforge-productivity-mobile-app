import { Redirect, Tabs, usePathname } from 'expo-router';
import { getTokenValue } from 'tamagui';

import { useAppStore, useAuthStore } from '../../store';
import { SCREEN_HEIGHT } from '../../constants';
import TabBarButton from '../../components/tabs/TabBarButton';
import CustomHeader from '@/app/components/tabs/CustomHeader';
import { TabRoute } from '@/app/entities';

const TabLayout = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const setisSearchBarOpen = useAppStore((s) => s.setIsSearchBarOpen);
  const authUser = useAuthStore((s) => s.authUser);

  const gray = getTokenValue('$gray3');

  const handleCloseSearchBar = () => setisSearchBarOpen(false);

  if (!authUser) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        header: (props: any) => (
          <CustomHeader
            {...props}
            isCurrentScreenHome={pathname === 'home'}
            isSearchBarOpen={isSearchBarOpen}
            closeSearchBar={handleCloseSearchBar}
          />
        ),
        tabBarStyle: {
          height: SCREEN_HEIGHT / 12,
          backgroundColor: gray,
          borderTopWidth: 0,
        },
        tabBarButton: TabBarButton,
      }}
      screenListeners={{
        tabPress: () => handleCloseSearchBar(),
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

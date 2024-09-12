import { Redirect, Tabs, usePathname } from 'expo-router';

import CustomHeader from '@/app/components/tabs/CustomHeader';
import { TabRoute } from '@/app/entities';
import { useAuth } from '@/app/hooks/useAuth';
import useCompletionDates from '@/app/hooks/useCompletionDates';
import useCustomColors from '@/app/hooks/useCustomColors';
import useSearchBarState from '@/app/hooks/useSearchBarState';
import CustomTabBarButton from '../../components/tabs/CustomTabBarButton';
import { SCREEN_HEIGHT } from '../../constants';

const TabLayout = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const { authUser } = useAuth();

  const { fetchCompletionDatesMap } = useCompletionDates();

  const { handleSearchBarClose } = useSearchBarState();

  const { customGray3 } = useCustomColors();

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

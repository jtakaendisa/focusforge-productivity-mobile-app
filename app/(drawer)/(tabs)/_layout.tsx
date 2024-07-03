import { Pressable } from 'react-native';
import { Link, Redirect, Tabs, useNavigation } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { getTokens } from 'tamagui';

import { useAuthStore } from '../../store';
import { SCREEN_HEIGHT } from '../../constants';
import TabBarButton from '../../components/tabs/TabBarButton';
import MenuIcon from '../../components/tabs/MenuIcon';
import { DrawerActions } from '@react-navigation/native';

const TabLayout = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const navigation = useNavigation();

  const gray = getTokens().color.$gray3.val;

  if (!authUser) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#111111',
          elevation: 0,
        },
        headerTintColor: '#fff',
        headerLeftContainerStyle: {
          paddingLeft: 8,
        },
        headerLeft: () => (
          <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <MenuIcon />
          </Pressable>
        ),
        tabBarStyle: {
          height: SCREEN_HEIGHT / 12,
          backgroundColor: gray,
          borderTopWidth: 0,
        },
        tabBarButton: TabBarButton,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          headerRight: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <AntDesign
                    name="infocirlceo"
                    color="gray"
                    size={24}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
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

import { Dimensions, Pressable } from 'react-native';
import { Link, Redirect, Tabs } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { getTokens } from 'tamagui';

import { useAuthStore } from '../store';
import TabBarButton from '../components/tabs/TabBarButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TabLayout = () => {
  const authUser = useAuthStore((s) => s.authUser);

  const black = getTokens().color.$black2.val;

  if (!authUser) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarButton: TabBarButton,
        tabBarStyle: {
          height: SCREEN_HEIGHT / 12,
          backgroundColor: black,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerRight: () => (
            <Link href="/" asChild>
              <Pressable>
                {({ pressed }) => (
                  <AntDesign
                    name="infocirlceo"
                    size={24}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen name="habits" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="timer" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
};

export default TabLayout;

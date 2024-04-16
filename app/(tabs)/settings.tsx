import { View, Text } from 'react-native';
import { Redirect, router } from 'expo-router';
import { Button } from 'tamagui';

import { useAuthStore } from '../store';
import { signOutAuthUser } from '../services/auth';

const SettingsScreen = () => {
  const authUser = useAuthStore((s) => s.authUser);
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

  if (!authUser) {
    <Redirect href="/(auth)" />;
  }

  const handleSignOut = async () => {
    await signOutAuthUser();
    setAuthUser(null);
    router.replace('/(auth)');
  };

  return (
    <View>
      <Text>SettingsScreen</Text>
      <Button onPress={handleSignOut}>Sign out</Button>
    </View>
  );
};

export default SettingsScreen;

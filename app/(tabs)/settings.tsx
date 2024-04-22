import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { Button } from 'tamagui';

import { useAuthStore } from '../store';
import { signOutAuthUser } from '../services/auth';

const SettingsScreen = () => {
  const setAuthUser = useAuthStore((s) => s.setAuthUser);

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

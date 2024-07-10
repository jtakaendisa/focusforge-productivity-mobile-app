import { Drawer } from 'expo-router/drawer';

import CustomDrawerContent from '../components/CustomDrawerContent';
import { getTokenValue } from 'tamagui';

export default function Layout() {
  const customBlack2 = getTokenValue('$customBlack2');
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: customBlack2,
        },
      }}
    />
  );
}

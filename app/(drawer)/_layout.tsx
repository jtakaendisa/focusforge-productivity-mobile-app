import { Drawer } from 'expo-router/drawer';

import CustomDrawerContent from '../components/CustomDrawerContent';

export default function Layout() {
  return (
    <Drawer
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#121212',
        },
      }}
    />
  );
}

import { Drawer } from 'expo-router/drawer';

import CustomDrawerContent from '../components/CustomDrawerContent';
import useCustomColors from '../hooks/useCustomColors';

export default function Layout() {
  const { customBlack2 } = useCustomColors();

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

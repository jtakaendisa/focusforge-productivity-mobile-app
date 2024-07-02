import { Drawer } from 'expo-router/drawer';

import CustomDrawerContent from '../components/CustomDrawerContent';

export default function Layout() {
  return <Drawer drawerContent={CustomDrawerContent} />;
}

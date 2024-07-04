import { TouchableOpacity } from 'react-native';
import MenuIcon from './MenuIcon';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const HeaderLeftActions = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <MenuIcon />
    </TouchableOpacity>
  );
};

export default HeaderLeftActions;

import { TabRoute } from '@/app/entities';
import { useSearchStore } from '@/app/store';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, usePathname } from 'expo-router';
import { getTokenValue, styled, Text, View } from 'tamagui';
import BarsSvg from '../icons/BarsSvg';
import InfoCircleSvg from '../icons/InfoCircleSvg';
import MagnifyingGlassSvg from '../icons/MagnifyingGlassSvg';
import RippleButton from './RippleButton';

interface Props {
  height: number;
  title?: string;
}

const SVG_SIZE = 24;

const DefaultHeader = ({ height, title }: Props) => {
  const navigation = useNavigation();
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const setIsSearchBarOpen = useSearchStore((s) => s.setIsSearchBarOpen);

  const toggleDrawerMenu = () => navigation.dispatch(DrawerActions.toggleDrawer());

  const customGray1 = getTokenValue('$customGray1');
  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container height={height}>
      <IconContainer onPress={toggleDrawerMenu} width={height} height={height}>
        <BarsSvg fill={customRed1} />
      </IconContainer>

      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>

      <View flexDirection="row">
        {pathname === 'home' && (
          <RippleButton fade onPress={() => {}}>
            <IconContainer width={height} height={height}>
              <InfoCircleSvg size={SVG_SIZE} fill={customGray1} />
            </IconContainer>
          </RippleButton>
        )}
        {pathname !== 'settings' && (
          <RippleButton fade onPress={() => setIsSearchBarOpen(true)}>
            <IconContainer width={height} height={height}>
              <MagnifyingGlassSvg size={SVG_SIZE} fill={customGray1} />
            </IconContainer>
          </RippleButton>
        )}
      </View>
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
});

const TitleContainer = styled(View, {
  flex: 1,
});

const Title = styled(Text, {
  fontSize: 20,
  color: 'white',
});

export default DefaultHeader;

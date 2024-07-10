import { styled, View, Text, getTokenValue } from 'tamagui';
import MenuIcon from './MenuIcon';
import { useNavigation, usePathname } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { TabRoute } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';
import { useAppStore } from '@/app/store';
import RippleButton from './RippleButton';

interface Props {
  height: number;
  title?: string;
}

const DefaultHeader = ({ height, title }: Props) => {
  const navigation = useNavigation();
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const setIsSearchBarOpen = useAppStore((s) => s.setIsSearchBarOpen);

  const customGray1 = getTokenValue('$customGray1');

  return (
    <Container height={height}>
      <IconContainer
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
        width={height}
        height={height}
      >
        <MenuIcon />
      </IconContainer>

      <TitleContainer>
        <Title>{title}</Title>
      </TitleContainer>

      <View flexDirection="row">
        {pathname === 'home' && (
          <RippleButton onPress={() => {}}>
            <IconContainer width={height} height={height}>
              <Svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <Path
                  d="M10 1.25C12.3206 1.25 14.5462 2.17187 16.1872 3.81282C17.8281 5.45376 18.75 7.67936 18.75 10C18.75 12.3206 17.8281 14.5462 16.1872 16.1872C14.5462 17.8281 12.3206 18.75 10 18.75C7.67936 18.75 5.45376 17.8281 3.81282 16.1872C2.17187 14.5462 1.25 12.3206 1.25 10C1.25 7.67936 2.17187 5.45376 3.81282 3.81282C5.45376 2.17187 7.67936 1.25 10 1.25ZM10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10C20 7.34784 18.9464 4.8043 17.0711 2.92893C15.1957 1.05357 12.6522 0 10 0C7.34784 0 4.8043 1.05357 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10C0 12.6522 1.05357 15.1957 2.92893 17.0711C4.8043 18.9464 7.34784 20 10 20ZM8.125 13.75C7.78125 13.75 7.5 14.0312 7.5 14.375C7.5 14.7188 7.78125 15 8.125 15H11.875C12.2188 15 12.5 14.7188 12.5 14.375C12.5 14.0312 12.2188 13.75 11.875 13.75H10.625V9.375C10.625 9.03125 10.3438 8.75 10 8.75H8.4375C8.09375 8.75 7.8125 9.03125 7.8125 9.375C7.8125 9.71875 8.09375 10 8.4375 10H9.375V13.75H8.125ZM10 7.1875C10.2486 7.1875 10.4871 7.08873 10.6629 6.91291C10.8387 6.7371 10.9375 6.49864 10.9375 6.25C10.9375 6.00136 10.8387 5.7629 10.6629 5.58709C10.4871 5.41127 10.2486 5.3125 10 5.3125C9.75136 5.3125 9.5129 5.41127 9.33709 5.58709C9.16127 5.7629 9.0625 6.00136 9.0625 6.25C9.0625 6.49864 9.16127 6.7371 9.33709 6.91291C9.5129 7.08873 9.75136 7.1875 10 7.1875Z"
                  fill={customGray1}
                />
              </Svg>
            </IconContainer>
          </RippleButton>
        )}
        {pathname !== 'settings' && (
          <RippleButton onPress={() => setIsSearchBarOpen(true)}>
            <IconContainer width={height} height={height}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18.0529 9.77865C18.0529 8.69206 17.8389 7.61611 17.4231 6.61223C17.0072 5.60836 16.3978 4.69621 15.6294 3.92788C14.8611 3.15954 13.9489 2.55007 12.9451 2.13425C11.9412 1.71843 10.8652 1.50441 9.77865 1.50441C8.69206 1.50441 7.61611 1.71843 6.61223 2.13425C5.60836 2.55007 4.69621 3.15954 3.92788 3.92788C3.15954 4.69621 2.55007 5.60836 2.13425 6.61223C1.71843 7.61611 1.50441 8.69206 1.50441 9.77865C1.50441 10.8652 1.71843 11.9412 2.13425 12.9451C2.55007 13.9489 3.15954 14.8611 3.92788 15.6294C4.69621 16.3978 5.60836 17.0072 6.61223 17.4231C7.61611 17.8389 8.69206 18.0529 9.77865 18.0529C10.8652 18.0529 11.9412 17.8389 12.9451 17.4231C13.9489 17.0072 14.8611 16.3978 15.6294 15.6294C16.3978 14.8611 17.0072 13.9489 17.4231 12.9451C17.8389 11.9412 18.0529 10.8652 18.0529 9.77865ZM16.1395 17.2067C14.4329 18.6735 12.2092 19.5573 9.77865 19.5573C4.37689 19.5573 0 15.1804 0 9.77865C0 4.37689 4.37689 0 9.77865 0C15.1804 0 19.5573 4.37689 19.5573 9.77865C19.5573 12.2092 18.6735 14.4329 17.2067 16.1395L24 22.9375L22.9375 24L16.1395 17.2067Z"
                  fill={customGray1}
                />
              </Svg>
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

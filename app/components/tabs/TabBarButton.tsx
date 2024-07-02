import { AccessibilityState, GestureResponderEvent } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { styled, View, Text, getTokens } from 'tamagui';

import { TabRoute } from '@/app/entities';
import TabBarIcon from './TabBarIcon';

interface Props {
  accessibilityState?: AccessibilityState;
  to?: string;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
}

const animationConfig = {
  duration: 120,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

const TabBarButton = ({ accessibilityState, to, onPress }: Props) => {
  const currentPath = (to?.substring(1) || 'index') as TabRoute;

  const isSelected = accessibilityState?.selected;

  const red = getTokens().color.$red1.val;
  const gray = getTokens().color.$gray1.val;

  const color = isSelected ? red : gray;

  const fontAnimation = useAnimatedStyle(() => ({
    fontSize: isSelected
      ? withTiming(13, animationConfig)
      : withTiming(12, animationConfig),
    fontWeight: isSelected ? 'bold' : 'normal',
  }));

  const widthAnimation = useAnimatedStyle(() => ({
    width: isSelected
      ? withTiming('85%', animationConfig)
      : withTiming('0%', animationConfig),
  }));

  return (
    <Container onPress={onPress}>
      <IconContainer>
        <TabBarIcon color={color} currentPath={currentPath} isSelected={isSelected} />
      </IconContainer>
      <AnimatedIconBackground isSelected={isSelected} style={widthAnimation} />
      <AnimatedLabel color={color} style={fontAnimation}>
        {currentPath === 'index' ? 'today' : currentPath}
      </AnimatedLabel>
    </Container>
  );
};

const Container = styled(View, {
  position: 'relative',
  flex: 1,
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingBottom: 6,
});

const IconContainer = styled(View, {
  position: 'absolute',
  top: 6,
  justifyContent: 'center',
  alignItems: 'center',
  width: '85%',
  height: 36,
  zIndex: 1000,
});

const IconBackground = styled(View, {
  position: 'absolute',
  top: 6,
  height: 36,
  borderRadius: 60,
  opacity: 0.6,
  variants: {
    isSelected: {
      true: {
        backgroundColor: '#962C42',
      },
      false: {
        backgroundColor: 'transparent',
      },
    },
  } as const,
});

const Label = styled(Text, {
  textTransform: 'capitalize',
});

const AnimatedIconBackground = Animated.createAnimatedComponent(IconBackground);
const AnimatedLabel = Animated.createAnimatedComponent(Label);

export default TabBarButton;

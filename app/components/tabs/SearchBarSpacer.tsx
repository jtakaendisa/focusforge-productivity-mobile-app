import useHeaderHeight from '@/app/hooks/useHeaderHeight';
import { useEffect } from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, View } from 'tamagui';

interface Props {
  isExpanded: boolean;
}

const animationConfig = {
  duration: 350,
};

const SearchBarSpacer = ({ isExpanded }: Props) => {
  const { headerHeight } = useHeaderHeight();

  const sharedIsExpanded = useSharedValue(isExpanded ? 1 : 0);

  const heightAnimation = useAnimatedStyle(() => ({
    height: sharedIsExpanded.value
      ? withTiming(headerHeight, animationConfig)
      : withTiming(0, animationConfig),
  }));

  useEffect(() => {
    sharedIsExpanded.value = isExpanded ? 1 : 0;
  }, [isExpanded]);

  return <AnimatedContainer style={heightAnimation} />;
};

const Container = styled(View, {
  width: '100%',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default SearchBarSpacer;

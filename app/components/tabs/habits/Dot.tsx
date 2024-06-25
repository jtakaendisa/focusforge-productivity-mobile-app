import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View, styled } from 'tamagui';

interface Props {
  listItem: number;
  listIndex: number;
}

const Dot = ({ listItem, listIndex }: Props) => {
  const isFilled = useSharedValue(listItem <= listIndex ? 1 : 0);

  const backgroundColorAnimation = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      isFilled.value,
      [0, 1],
      ['transparent', '#C73A57']
    ),
  }));

  useEffect(() => {
    isFilled.value = listItem <= listIndex ? withTiming(1) : withTiming(0);
  }, [listItem, listIndex]);

  return <AnimatedContainer style={backgroundColorAnimation} />;
};

const Container = styled(View, {
  width: 8,
  height: 8,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: '#C73A57',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);

export default Dot;

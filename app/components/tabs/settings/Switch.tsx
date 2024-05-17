import { useEffect } from 'react';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View, styled } from 'tamagui';

interface Props {
  value: 0 | 1;
  onToggle: () => void;
}

const Switch = ({ value, onToggle }: Props) => {
  const sharedValue = useSharedValue(value);

  const backgroundAnimation = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      sharedValue.value,
      [0, 1],
      ['#a8a8a8', '#962C42']
    ),
  }));

  const thumbAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(sharedValue.value, [0, 1], [2, 20]) }],
    backgroundColor: interpolateColor(sharedValue.value, [0, 1], ['#333', 'white']),
  }));

  useEffect(() => {
    sharedValue.value = value ? withTiming(1) : withTiming(0);
  }, [value]);

  return (
    <AnimatedContainer onPress={onToggle} style={backgroundAnimation}>
      <AnimatedThumb style={thumbAnimation} />
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  width: 40,
  height: 20,
  borderRadius: 10,
  marginLeft: 10,
});

const Thumb = styled(View, {
  width: 18,
  height: 18,
  borderRadius: 10,
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedThumb = Animated.createAnimatedComponent(Thumb);

export default Switch;

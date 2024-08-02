import { useEffect } from 'react';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { View, getTokenValue, styled } from 'tamagui';

interface Props {
  value: 0 | 1;
  onToggle: () => void;
}

const Switch = ({ value, onToggle }: Props) => {
  const sharedValue = useSharedValue(value);

  const customGray5 = getTokenValue('$customGray5');
  const customGray6 = getTokenValue('$customGray6');
  const customRed3 = getTokenValue('$customRed3');

  const backgroundAnimation = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      sharedValue.value,
      [0, 1],
      [customGray5, customRed3]
    ),
  }));

  const thumbAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(sharedValue.value, [0, 1], [2, 23]) }],
    backgroundColor: interpolateColor(
      sharedValue.value,
      [0, 1],
      [customGray6, 'white']
    ),
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
  width: 46,
  height: 24,
  borderRadius: 12,
});

const Thumb = styled(View, {
  width: 20,
  height: 20,
  borderRadius: 10,
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedThumb = Animated.createAnimatedComponent(Thumb);

export default Switch;

import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View, Text, styled } from 'tamagui';

interface Props {
  duration: number;
  width: number;
  scrollX: SharedValue<number>;
  index: number;
}

const DurationItem = ({ duration, width, scrollX, index }: Props) => {
  const scrollAnimation = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

    const opacityAnimation = interpolate(
      scrollX.value,
      inputRange,
      [0.4, 1, 0.4],
      Extrapolation.CLAMP
    );

    const scaleAnimation = interpolate(
      scrollX.value,
      inputRange,
      [0.7, 1, 0.7],
      Extrapolation.CLAMP
    );

    return {
      opacity: opacityAnimation,
      transform: [{ scale: scaleAnimation }],
    };
  });

  const Container = styled(View, {
    width,
    justifyContent: 'center',
    alignItems: 'center',
  });

  const DurationText = styled(Text, {
    fontSize: width * 0.7,
    color: 'white',
    fontWeight: '900',
  });

  const AnimatedDurationText = Animated.createAnimatedComponent(DurationText);

  return (
    <Container>
      <AnimatedDurationText style={scrollAnimation}>{duration}</AnimatedDurationText>
    </Container>
  );
};

export default DurationItem;

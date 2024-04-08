import { useWindowDimensions } from 'tamagui';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';

interface Props {
  index: number;
  x: SharedValue<number>;
}

const Dot = ({ index, x }: Props) => {
  const { width } = useWindowDimensions();

  const dotAnimation = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [10, 20, 10],
      Extrapolation.CLAMP
    );

    const opacityAnimation = interpolate(
      x.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );

    return {
      width: widthAnimation,
      opacity: opacityAnimation,
    };
  });

  const colorAnimation = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, width, 2 * width],
      ['#005b4f', '#1e2169', '#f15937']
    );

    return {
      backgroundColor,
    };
  });

  return <Animated.View style={[styles.dot, dotAnimation, colorAnimation]} />;
};

const styles = StyleSheet.create({
  dot: {
    height: 10,
    backgroundColor: 'black',
    borderRadius: 5,
  },
});

export default Dot;

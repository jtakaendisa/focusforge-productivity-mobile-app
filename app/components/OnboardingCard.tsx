import { View, Text, useWindowDimensions, styled } from 'tamagui';
import LottieView from 'lottie-react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { OnboardingData } from '@/data';

interface Props {
  item: OnboardingData;
  index: number;
  x: SharedValue<number>;
}

const OnboardingCard = ({ item, index, x }: Props) => {
  const { animation, backgroundColor, text, textColor } = item;
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const circleAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [1, 4, 4],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
    };
  });

  const lottieAnimation = useAnimatedStyle(() => {
    const translateY = interpolate(
      x.value,
      [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
      [200, 0, -200],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  const Container = styled(View, {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    marginBottom: 120,
  });

  const CircleContainer = styled(View, {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  });

  const LottieImage = styled(LottieView, {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.9,
  });

  const OnboardingText = styled(Text, {
    color: textColor,
    textAlign: 'center',
    fontSize: 44,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 20,
  });

  const Circle = styled(View, {
    width: SCREEN_WIDTH * 1.2,
    height: SCREEN_WIDTH * 1.2,
    backgroundColor,
    borderRadius: SCREEN_WIDTH / 2,
  });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <Container>
      <CircleContainer>
        <AnimatedCircle style={circleAnimation} />
      </CircleContainer>
      <Animated.View style={lottieAnimation}>
        <LottieImage
          source={animation}
          // autoPlay loop
        />
      </Animated.View>
      <OnboardingText>{text}</OnboardingText>
    </Container>
  );
};

export default OnboardingCard;

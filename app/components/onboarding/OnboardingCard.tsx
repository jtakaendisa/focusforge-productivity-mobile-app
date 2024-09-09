import { View, Text, styled } from 'tamagui';
import LottieView from 'lottie-react-native';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { OnboardingData } from '@/data';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/app/constants';

interface Props {
  item: OnboardingData;
  index: number;
  x: SharedValue<number>;
}

const OnboardingCard = ({ item, index, x }: Props) => {
  const { animation, backgroundColor, text, textColor } = item;

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

  return (
    <Container>
      <CircleContainer>
        <AnimatedCircle style={[{ backgroundColor }, circleAnimation]} />
      </CircleContainer>
      <AnimatedImageContainer style={lottieAnimation}>
        <LottieImage source={animation} loop />
      </AnimatedImageContainer>
      <OnboardingText style={{ color: textColor }}>{text}</OnboardingText>
    </Container>
  );
};

const Container = styled(View, {
  justifyContent: 'space-around',
  alignItems: 'center',
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  marginBottom: 120,
});

const CircleContainer = styled(View, {
  position: 'absolute',
  top: 0,
  left: 0,
  right: -0.25 * SCREEN_WIDTH,
  bottom: 0,
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const Circle = styled(View, {
  width: SCREEN_WIDTH * 1.2,
  height: SCREEN_WIDTH * 1.2,
  borderRadius: SCREEN_WIDTH / 2,
});

const ImageContainer = styled(View);

const LottieImage = styled(LottieView, {
  width: SCREEN_WIDTH * 0.9,
  height: SCREEN_WIDTH * 0.9,
});

const OnboardingText = styled(Text, {
  textAlign: 'center',
  fontSize: 44,
  fontWeight: 'bold',
  marginBottom: 10,
  marginHorizontal: 20,
});

const AnimatedImageContainer = Animated.createAnimatedComponent(ImageContainer);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default OnboardingCard;

import { TIMER_LIST_ITEM_WIDTH } from '@/app/constants';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { getTokenValue, styled, Text, View } from 'tamagui';

interface Props {
  timer: number;
  index: number;
  scrollX: SharedValue<number>;
}

const TimerListItem = ({ timer, index, scrollX }: Props) => {
  const customGray1 = getTokenValue('$customGray1');
  const customGray2 = getTokenValue('$customGray2');
  const customGray3 = getTokenValue('$customGray3');

  const inputRange = [
    (index - 2) * TIMER_LIST_ITEM_WIDTH,
    (index - 1) * TIMER_LIST_ITEM_WIDTH,
    index * TIMER_LIST_ITEM_WIDTH,
    (index + 1) * TIMER_LIST_ITEM_WIDTH,
    (index + 2) * TIMER_LIST_ITEM_WIDTH,
  ];

  const transformAnimation = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      inputRange,
      [
        0,
        -TIMER_LIST_ITEM_WIDTH / 3,
        -TIMER_LIST_ITEM_WIDTH / 2,
        -TIMER_LIST_ITEM_WIDTH / 3,
        0,
      ],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          translateY,
        },
        {
          translateX: TIMER_LIST_ITEM_WIDTH / 2 + TIMER_LIST_ITEM_WIDTH,
        },
      ],
    };
  });

  const circleAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.75, 0.85, 1, 0.85, 0.75],
      Extrapolation.CLAMP
    );

    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      customGray3,
      customGray3,
      customGray2,
      customGray3,
      customGray3,
    ]);

    const borderColor = interpolateColor(scrollX.value, inputRange, [
      customGray1,
      customGray1,
      'white',
      customGray1,
      customGray1,
    ]);

    return {
      transform: [
        {
          scale,
        },
      ],
      backgroundColor,
      borderColor,
    };
  });

  const textAnimation = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollX.value,
      inputRange,
      [20, 20, 24, 20, 20],
      Extrapolation.CLAMP
    );

    const color = interpolateColor(scrollX.value, inputRange, [
      customGray1,
      customGray1,
      'white',
      customGray1,
      customGray1,
    ]);

    return {
      fontSize,
      color,
    };
  });

  return (
    <AnimatedContainer style={transformAnimation}>
      <AnimatedCircle style={circleAnimation}>
        <AnimatedText style={textAnimation}>{timer}</AnimatedText>
      </AnimatedCircle>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: TIMER_LIST_ITEM_WIDTH,
  height: TIMER_LIST_ITEM_WIDTH,
});

const Circle = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: TIMER_LIST_ITEM_WIDTH * 0.8,
  height: TIMER_LIST_ITEM_WIDTH * 0.8,
  borderRadius: TIMER_LIST_ITEM_WIDTH,
  borderWidth: 2,
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default TimerListItem;

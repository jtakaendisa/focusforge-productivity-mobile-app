import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { TIMER_LIST_ITEM_WIDTH } from '../constants';
import useCustomColors from './useCustomColors';

const useTimerAnimation = (
  isCountingDown: boolean,
  isCountdownPaused: boolean,
  remainingTime: any,
  timerDuration: number,
  containerHeight: number | null
) => {
  const {
    customGreen2,
    customGreen3,
    customPurple1,
    customRed7,
    customRed8,
    customYellow1,
    customYellow2,
  } = useCustomColors();

  const startButtonAnimation = useAnimatedStyle(() => {
    const width =
      isCountingDown || isCountdownPaused
        ? withTiming(TIMER_LIST_ITEM_WIDTH * 0.8)
        : withTiming(TIMER_LIST_ITEM_WIDTH);

    const height =
      isCountingDown || isCountdownPaused
        ? withTiming(TIMER_LIST_ITEM_WIDTH * 0.8)
        : withTiming(TIMER_LIST_ITEM_WIDTH / 2.5);

    const borderRadius =
      isCountingDown || isCountdownPaused
        ? withTiming(TIMER_LIST_ITEM_WIDTH)
        : withTiming(8);

    const backgroundColor = isCountingDown
      ? withTiming(customYellow2)
      : isCountdownPaused
      ? withTiming(customGreen3)
      : withTiming(customGreen3);

    const borderColor = isCountingDown
      ? withTiming(customYellow1)
      : isCountdownPaused
      ? withTiming(customGreen2)
      : withTiming(customGreen2);

    const translateY =
      isCountingDown || isCountdownPaused
        ? withTiming(0)
        : withDelay(300, withTiming(TIMER_LIST_ITEM_WIDTH / 1.25));

    const translateX =
      isCountingDown || isCountdownPaused
        ? withDelay(300, withTiming(-TIMER_LIST_ITEM_WIDTH / 1.5))
        : withTiming(0);

    return {
      width,
      height,
      borderRadius,
      backgroundColor,
      borderColor,
      transform: [
        {
          translateY,
        },
        {
          translateX,
        },
      ],
    };
  });

  const resetButtonAnimation = useAnimatedStyle(() => {
    const width =
      isCountingDown || isCountdownPaused
        ? withTiming(TIMER_LIST_ITEM_WIDTH * 0.8)
        : withTiming(0);

    const height =
      isCountingDown || isCountdownPaused
        ? withTiming(TIMER_LIST_ITEM_WIDTH * 0.8)
        : withTiming(0);

    const backgroundColor =
      isCountingDown || isCountdownPaused
        ? withTiming(customRed8)
        : withTiming('transparent');

    const borderColor =
      isCountingDown || isCountdownPaused
        ? withTiming(customRed7)
        : withTiming('transparent');

    const translateX =
      isCountingDown || isCountdownPaused
        ? withDelay(300, withTiming(TIMER_LIST_ITEM_WIDTH / 1.5))
        : withTiming(0);

    return {
      width,
      height,
      backgroundColor,
      borderColor,
      transform: [
        {
          translateX,
        },
      ],
    };
  });

  const countdownSheetAnimation = useAnimatedStyle(() => {
    const translateY = interpolate(
      remainingTime.value,
      [0, timerDuration * 60],
      [containerHeight || 0, 0],
      Extrapolation.CLAMP
    );

    const backgroundColor =
      isCountingDown || isCountdownPaused ? customPurple1 : 'transparent';

    return {
      transform: [{ translateY }],
      backgroundColor,
    };
  });

  return {
    startButtonAnimation,
    resetButtonAnimation,
    countdownSheetAnimation,
  };
};

export default useTimerAnimation;

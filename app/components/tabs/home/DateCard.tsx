import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, View, Text, getTokenValue } from 'tamagui';

import { DATE_CARD_HEIGHT } from '@/app/constants';
import { toFormattedDateString } from '@/app/utils';

interface Props {
  day: {
    weekday: string;
    date: Date;
  };
  selectedDate: Date;
  onPress: (date: Date) => void;
}

const DateCard = ({ day, selectedDate, onPress }: Props) => {
  const { date, weekday } = day;

  const isSelected = useSharedValue(0);

  const customGray1 = getTokenValue('$customGray1');
  const customGray2 = getTokenValue('$customGray2');
  const customGray3 = getTokenValue('$customGray3');
  const customRed1 = getTokenValue('$customRed1');
  const customRed3 = getTokenValue('$customRed3');

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(isSelected.value, [0, 1], [customGray1, 'white']),
  }));

  const weekdayBackgroundAnimation = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      isSelected.value,
      [0, 1],
      [customGray3, customRed1]
    ),
  }));

  const dateBackgroundAnimation = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      isSelected.value,
      [0, 1],
      [customGray2, customRed3]
    ),
  }));

  useEffect(() => {
    isSelected.value =
      toFormattedDateString(selectedDate) === toFormattedDateString(date)
        ? withTiming(1)
        : withTiming(0);
  }, [date, selectedDate]);

  return (
    <Container onPress={() => onPress(date)}>
      <AnimatedWeekdayContainer style={weekdayBackgroundAnimation}>
        <AnimatedWeekdayText style={textColorAnimation}>{weekday}</AnimatedWeekdayText>
      </AnimatedWeekdayContainer>
      <AnimatedDateContainer style={dateBackgroundAnimation}>
        <AnimatedDateText style={textColorAnimation}>{date.getDate()}</AnimatedDateText>
      </AnimatedDateContainer>
    </Container>
  );
};

const Container = styled(View, {
  position: 'relative',
  flexDirection: 'column',
  alignItems: 'center',
  width: 50,
  height: DATE_CARD_HEIGHT,
  borderRadius: 18,
  overflow: 'hidden',
});

const WeekdayContainer = styled(View, {
  position: 'absolute',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  paddingTop: 4,
});

const DateContainer = styled(View, {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: 0,
  width: '100%',
  height: '64%',
  borderRadius: 18,
});

const WeekdayText = styled(Text, {
  fontSize: 11.5,
});

const DateText = styled(Text, {
  fontSize: 16,
});

const AnimatedWeekdayContainer = Animated.createAnimatedComponent(WeekdayContainer);
const AnimatedDateContainer = Animated.createAnimatedComponent(DateContainer);
const AnimatedWeekdayText = Animated.createAnimatedComponent(WeekdayText);
const AnimatedDateText = Animated.createAnimatedComponent(DateText);

export default DateCard;

import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { styled, View, Text } from 'tamagui';

import { DATE_CARD_HEIGHT } from '@/app/constants';
import { toFormattedDateString } from '@/app/utils';

interface Props {
  day: {
    weekday: string;
    date: number;
  };
}

const HabitDateCard = ({ day }: Props) => {
  const { date, weekday } = day;

  const isSelected = useSharedValue(0);

  // const white = getTokens().color.$white.val;
  // const textGray = getTokens().color.$gray1.val;
  // const lightGray = getTokens().color.$gray2.val;
  // const darkGray = getTokens().color.$gray3.val;
  // const lightRed = getTokens().color.$red1.val;
  // const darkRed = getTokens().color.$red3.val;

  // const textColorAnimation = useAnimatedStyle(() => ({
  //   color: interpolateColor(isSelected.value, [0, 1], [textGray, white]),
  // }));

  // const weekdayBackgroundAnimation = useAnimatedStyle(() => ({
  //   backgroundColor: interpolateColor(isSelected.value, [0, 1], [darkGray, lightRed]),
  // }));

  // const dateBackgroundAnimation = useAnimatedStyle(() => ({
  //   backgroundColor: interpolateColor(isSelected.value, [0, 1], [lightGray, darkRed]),
  // }));

  //   useEffect(() => {
  //     isSelected.value =
  //       toFormattedDateString(selectedDate) === toFormattedDateString(date)
  //         ? withTiming(1)
  //         : withTiming(0);
  //   }, [date, selectedDate]);

  return (
    <Container>
      <WeekdayText>{weekday}</WeekdayText>
      <DateContainer>
        <DateText>{date}</DateText>
      </DateContainer>
    </Container>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  width: 50,
  height: DATE_CARD_HEIGHT,
});

const DateContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  bottom: 0,
  width: 36,
  height: 36,
  borderRadius: 14,
  borderWidth: 2,
  borderColor: 'green',
});

const WeekdayText = styled(Text, {
  fontSize: 11.5,
});

const DateText = styled(Text, {
  fontSize: 16,
});

export default HabitDateCard;

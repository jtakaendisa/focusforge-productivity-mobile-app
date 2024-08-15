import { styled, Text, View } from 'tamagui';

import { DATE_CARD_HEIGHT } from '@/app/constants';
import { setDateToMidnight, toFormattedDateString } from '@/app/utils';

interface Props {
  day: {
    weekday: string;
    date: number;
    originalDay: Date;
    isPressable: boolean;
    isCompleted: boolean;
  };
  onComplete: (selectedDate: Date) => void;
}

const HabitDateCard = ({ day, onComplete }: Props) => {
  const { date, weekday, originalDay, isPressable, isCompleted } = day;

  const startOfOriginalDay = setDateToMidnight(originalDay);
  const startOfCurrentDate = setDateToMidnight(new Date());

  const isToday =
    toFormattedDateString(startOfOriginalDay) ===
    toFormattedDateString(startOfCurrentDate);

  const isPassedDeadline = startOfOriginalDay < startOfCurrentDate;

  const isDisabled =
    !isPressable || startOfOriginalDay.getTime() !== startOfCurrentDate.getTime();

  const backgroundColor = isPressable
    ? isCompleted
      ? '$customGreen3'
      : isToday
      ? '$customYellow2'
      : isPassedDeadline
      ? '$customRed8'
      : '$customGray2'
    : '$customGray2';

  const borderColor = isPressable
    ? isCompleted
      ? '$customGreen2'
      : isToday
      ? '$customYellow1'
      : isPassedDeadline
      ? '$customRed7'
      : '$customGray1'
    : 'transparent';

  const handleComplete = () => onComplete(originalDay);

  return (
    <Container>
      <WeekdayText>{weekday}</WeekdayText>
      <DateContainer
        animation="fast"
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        disabled={isDisabled}
        onPress={handleComplete}
      >
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
  width: 36,
  height: 36,
  borderRadius: 14,
  borderWidth: 2,
});

const WeekdayText = styled(Text, {
  fontSize: 11.5,
});

const DateText = styled(Text, {
  fontSize: 16,
});

export default HabitDateCard;

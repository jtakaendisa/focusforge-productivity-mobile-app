import { styled, Text, View } from 'tamagui';

import { CURRENT_DATE, DATE_CARD_HEIGHT } from '@/app/constants';

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

  const backgroundColor = isPressable
    ? isCompleted
      ? 'green'
      : '$customGray2'
    : '$customGray2';
  const borderColor = isPressable ? (isCompleted ? 'green' : 'gray') : 'transparent';

  const handleComplete = () => onComplete(originalDay);

  return (
    <Container>
      <WeekdayText>{weekday}</WeekdayText>
      <DateContainer
        backgroundColor={backgroundColor}
        borderColor={borderColor}
        disabled={!isPressable || originalDay > CURRENT_DATE}
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

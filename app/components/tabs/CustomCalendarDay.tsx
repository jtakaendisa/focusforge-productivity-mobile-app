import { styled, View, Text } from 'tamagui';
import { DateData } from 'react-native-calendars';
import { DayState } from 'react-native-calendars/src/types';
import { setDateToMidnight } from '@/app/utils';
import { UTCDate } from '@date-fns/utc';

interface Props {
  date?: DateData;
  state?: DayState;
  isPressable: boolean;
  isCompleted?: boolean;
  isPassedDeadline?: boolean;
  onComplete: (selectedDate?: string) => void;
}

const CustomCalendarDay = ({
  date,
  state,
  isPressable,
  isCompleted,
  isPassedDeadline,
  onComplete,
}: Props) => {
  const startOfCurrentDate = setDateToMidnight(new UTCDate());
  const parsedDate = date ? new Date(date.dateString) : undefined;

  const isToday = state === 'today';

  const isDisabled =
    !isPressable || parsedDate?.getTime() !== startOfCurrentDate.getTime();

  const textColor = state !== 'disabled' ? 'white' : '$customGray1';

  const backgroundColor = isPressable
    ? isCompleted
      ? '$customGreen3'
      : isToday
      ? '$customYellow2'
      : isPassedDeadline
      ? '$customRed8'
      : '$customGray2'
    : 'transparent';

  const borderColor =
    isPressable && state !== 'disabled'
      ? isCompleted
        ? '$customGreen2'
        : isToday
        ? '$customYellow1'
        : isPassedDeadline
        ? '$customRed7'
        : '$customGray2'
      : 'transparent';

  const handleComplete = () => onComplete(date?.dateString);

  return (
    <Container
      backgroundColor={backgroundColor}
      borderColor={borderColor}
      disabled={isDisabled}
      onPress={handleComplete}
    >
      <DateText color={textColor}>{date?.day}</DateText>
    </Container>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 42,
  height: 42,
  borderRadius: 16,
  borderWidth: 2,
});

const DateText = styled(Text, {
  fontSize: 16,
});

export default CustomCalendarDay;

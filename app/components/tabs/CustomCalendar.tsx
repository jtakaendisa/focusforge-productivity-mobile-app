import { Calendar } from 'react-native-calendars';
import CustomCalendarTitle from './CustomCalendarTitle';
import CalendarArrowIcon from './CalendarArrowIcon';
import { toFormattedDateString } from '@/app/utils';
import CustomCalendarDay from './CustomCalendarDay';
import { startOfDay } from 'date-fns';
import { Theme } from 'react-native-calendars/src/types';
import { getTokenValue } from 'tamagui';
import { CompletionDate } from '@/app/entities';

interface Props {
  completionDates: CompletionDate[];
  onComplete: (selectedDate?: string) => void;
}

const CustomCalendar = ({ completionDates, onComplete }: Props) => {
  const customRed2 = getTokenValue('$customRed2');

  return (
    <Calendar
      renderHeader={(date) => <CustomCalendarTitle date={date} />}
      renderArrow={(direction) => <CalendarArrowIcon direction={direction} />}
      dayComponent={({ date, state }) => {
        const completionDate = completionDates.find(
          (entry) =>
            date && entry.date === toFormattedDateString(new Date(date.dateString))
        );

        return (
          <CustomCalendarDay
            date={date}
            state={state}
            isPressable={!!completionDate}
            isCompleted={completionDate?.isCompleted}
            isPassedDeadline={
              date && new Date(date.dateString) < startOfDay(new Date())
            }
            onComplete={onComplete}
          />
        );
      }}
      theme={{
        ['stylesheet.calendar.header' as keyof Theme]: {
          dayTextAtIndex0: {
            color: customRed2,
          },
          dayTextAtIndex6: {
            color: customRed2,
          },
        },
        calendarBackground: 'transparent',
      }}
    />
  );
};

export default CustomCalendar;

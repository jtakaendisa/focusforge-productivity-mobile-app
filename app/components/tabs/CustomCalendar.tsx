import { CompletionDate } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import { toFormattedDateString } from '@/app/utils';
import { startOfDay } from 'date-fns';
import { StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Theme } from 'react-native-calendars/src/types';
import CalendarArrowIcon from './CalendarArrowIcon';
import CustomCalendarDay from './CustomCalendarDay';
import CustomCalendarTitle from './CustomCalendarTitle';

interface Props {
  completionDates: CompletionDate[];
  onComplete: (selectedDate?: string) => void;
}

const CustomCalendar = ({ completionDates, onComplete }: Props) => {
  const { customRed2 } = useCustomColors();

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
      style={styles.calendar}
    />
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginTop: 12,
    marginBottom: 36,
  },
});

export default CustomCalendar;

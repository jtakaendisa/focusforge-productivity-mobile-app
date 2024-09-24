import { MutableRefObject } from 'react';
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { toFormattedDateString } from '../utils';

const useDatePicker = (
  setStartDateRef: MutableRefObject<((...event: any[]) => void) | null>,
  setEndDateRef: MutableRefObject<((...event: any[]) => void) | null>,
  isRecurring: boolean
) => {
  const handleDateSelect = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined,
    mode: 'start' | 'end'
  ) => {
    if (selectedDate) {
      if (mode === 'start') {
        setStartDateRef.current?.(selectedDate);
      } else {
        if (isRecurring) {
          if (
            toFormattedDateString(selectedDate) !== toFormattedDateString(new Date())
          ) {
            setEndDateRef.current?.(selectedDate);
          } else {
            setEndDateRef.current?.();
          }
        } else {
          setEndDateRef.current?.(selectedDate);
        }
      }
    }
  };

  const showDatePicker = (mode: 'start' | 'end') => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange: (e, date) => handleDateSelect(e, date, mode),
      is24Hour: true,
      minimumDate: new Date(),
    });
  };

  const handleStartDateSelect = () => showDatePicker('start');

  const handleEndDateSelect = () => showDatePicker('end');

  const handleEndDateClear = () => setEndDateRef.current?.();

  return { handleStartDateSelect, handleEndDateSelect, handleEndDateClear };
};

export default useDatePicker;

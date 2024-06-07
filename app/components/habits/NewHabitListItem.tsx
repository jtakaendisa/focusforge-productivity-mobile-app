import { Control } from 'react-hook-form';

import { Priority, Reminder } from '@/app/entities';
import { NewHabitData } from '@/app/newHabit';
import CategoryListModule from './CategoryListModule';
import DetailsListModule from './DetailsListModule';
import FrequencyListModule from './FrequencyListModule';
import DurationListModule from './DurationListModule';

interface Props {
  item: 0 | 1 | 2 | 3;
  control: Control<NewHabitData>;
  currentPriority: Priority;
  startDate: Date;
  endDate?: Date;
  reminders: Reminder[];
  navigateForward: () => void;
}

const NewHabitListItem = ({
  item,
  control,
  currentPriority,
  startDate,
  endDate,
  reminders,
  navigateForward,
}: Props) => {
  switch (item) {
    case 0:
      return <CategoryListModule control={control} navigateForward={navigateForward} />;
    case 1:
      return <DetailsListModule control={control} />;
    case 2:
      return <FrequencyListModule control={control} />;
    case 3:
      return (
        <DurationListModule
          control={control}
          currentPriority={currentPriority}
          startDate={startDate}
          endDate={endDate}
          reminders={reminders}
        />
      );
  }
};

export default NewHabitListItem;

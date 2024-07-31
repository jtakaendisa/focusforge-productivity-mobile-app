import { Control } from 'react-hook-form';

import CategoryListModule from './CategoryListModule';
import DetailsListModule from './DetailsListModule';
import DurationListModule from './DurationListModule';
import FrequencyListModule from './FrequencyListModule';
import { NewActivityData } from '@/app/entities';

interface Props {
  item: 0 | 1 | 2 | 3;
  control: Control<NewActivityData>;
  navigateForward: () => void;
}

const NewHabitListItem = ({ item, control, navigateForward }: Props) => {
  switch (item) {
    case 0:
      return <CategoryListModule control={control} navigateForward={navigateForward} />;
    case 1:
      return <DetailsListModule control={control} />;
    case 2:
      return <FrequencyListModule control={control} />;
    case 3:
      return <DurationListModule control={control} />;
  }
};

export default NewHabitListItem;

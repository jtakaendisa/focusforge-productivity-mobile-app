import CategoryListModule from './CategoryListModule';
import DetailsListModule from './DetailsListModule';
import FrequencyListModule from './FrequencyListModule';
import DurationListModule from './DurationListModule';

interface Props {
  item: 0 | 1 | 2 | 3;
}

const HabitListItem = ({ item }: Props) => {
  switch (item) {
    case 0:
      return <CategoryListModule />;
    case 1:
      return <DetailsListModule />;
    case 2:
      return <FrequencyListModule />;
    case 3:
      return <DurationListModule />;
  }
};

export default HabitListItem;

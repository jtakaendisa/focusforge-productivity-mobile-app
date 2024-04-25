import { useTodoStore } from '@/app/store';
import { View, Text, styled } from 'tamagui';

const FilterBar = () => {
  const setFilter = useTodoStore((s) => s.setFilter);

  const Container = styled(View, {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  });

  return (
    <Container>
      <Text onPress={() => setFilter('all')} color="black">
        All
      </Text>
      <Text onPress={() => setFilter('open')} color="black">
        Open
      </Text>
      <Text onPress={() => setFilter('finished')} color="black">
        Finished
      </Text>
    </Container>
  );
};

export default FilterBar;

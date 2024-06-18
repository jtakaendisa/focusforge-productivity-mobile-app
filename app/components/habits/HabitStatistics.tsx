import { styled, View, Text } from 'tamagui';

import { Habit } from '@/app/entities';

interface Props {
  selectedHabit: Habit;
}

const HabitStatistics = ({ selectedHabit }: Props) => {
  return (
    <Container>
      <Text>Stats</Text>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

export default HabitStatistics;

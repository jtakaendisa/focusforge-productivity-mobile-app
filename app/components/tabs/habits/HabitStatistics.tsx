import { styled, Text, View } from 'tamagui';

import { Activity } from '@/app/entities';

interface Props {
  selectedHabit: Activity;
}

const HabitStatistics = ({ selectedHabit }: Props) => {
  return (
    <Container>
      <Text>Statistics</Text>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
});

export default HabitStatistics;

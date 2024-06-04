import { useEffect } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import { styled, Text, View } from 'tamagui';

import { SCREEN_WIDTH } from '@/app/constants';
import SquareCheckbox from '../tabs/SquareCheckbox';

interface Props {
  day: string;
  isSelected: boolean;
  onSelect: (day: string) => void;
}

const WeekdayCard = ({ day, isSelected, onSelect }: Props) => {
  const isChecked = useSharedValue(isSelected ? 1 : 0);

  useEffect(() => {
    isChecked.value = isSelected ? withTiming(1) : withTiming(0);
  }, [isSelected]);

  return (
    <Container onPress={() => onSelect(day)}>
      <SquareCheckbox isChecked={isChecked} />
      <Text color="#8C8C8C">{day}</Text>
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  width: SCREEN_WIDTH / 3,
  height: 42,
  paddingHorizontal: 8,
});

export default WeekdayCard;

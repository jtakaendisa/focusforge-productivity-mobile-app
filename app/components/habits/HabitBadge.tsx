import { styled, View, Text } from 'tamagui';

import { HabitFrequency } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';

interface Props {
  frequency: HabitFrequency;
}

const HabitBadge = ({ frequency }: Props) => {
  const generateBadgeText = (frequency: HabitFrequency) => {
    const { type, isRepeatedEvery, isRepeatedOn } = frequency;

    switch (type) {
      case 'daily':
        return 'Every day';
      case 'specific':
        return isRepeatedOn?.map(
          (day, index) =>
            toTruncatedText(day, 3, true) +
            (index < isRepeatedOn.length - 1 ? ' - ' : '')
        );
      case 'repeats':
        return `Every ${isRepeatedEvery} days`;
    }
  };

  return (
    <Container>
      <BadgeText>{generateBadgeText(frequency)}</BadgeText>
    </Container>
  );
};

const Container = styled(View, {
  alignSelf: 'flex-start',
  paddingHorizontal: 6,
  paddingVertical: 2,
  backgroundColor: 'rgba(140, 140, 140, 0.25)',
  borderRadius: 4,
});

const BadgeText = styled(Text, {
  fontSize: 12,
  fontWeight: 'bold',
});

export default HabitBadge;

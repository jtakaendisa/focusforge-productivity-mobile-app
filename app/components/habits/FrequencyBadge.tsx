import { styled, View, Text } from 'tamagui';

import { HabitFrequency } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';

interface Props {
  frequency: HabitFrequency;
  isForm?: boolean;
}

const FrequencyBadge = ({ frequency, isForm }: Props) => {
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
    <Container isForm={isForm}>
      <BadgeText isForm={isForm}>{generateBadgeText(frequency)}</BadgeText>
    </Container>
  );
};

const Container = styled(View, {
  variants: {
    isForm: {
      true: {
        alignSelf: 'center',
      },
      undefined: {
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: 'rgba(140, 140, 140, 0.25)',
        borderRadius: 4,
      },
    },
  } as const,
});

const BadgeText = styled(Text, {
  variants: {
    isForm: {
      true: {
        color: '#8C8C8C',
      },
      undefined: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
      },
    },
  } as const,
});

export default FrequencyBadge;

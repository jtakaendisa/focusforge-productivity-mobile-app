import { styled, View, Text } from 'tamagui';

import { Frequency } from '@/app/entities';
import { toTruncatedText } from '@/app/utils';

interface Props {
  frequency: Frequency;
  isForm?: boolean;
}

const FrequencyBadge = ({ frequency, isForm }: Props) => {
  const generateBadgeText = (frequency: Frequency) => {
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
        backgroundColor: '$customGray4',
        borderRadius: 4,
      },
    },
  } as const,
});

const BadgeText = styled(Text, {
  variants: {
    isForm: {
      true: {
        color: '$customGray1',
      },
      undefined: {
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
      },
    },
  } as const,
});

export default FrequencyBadge;

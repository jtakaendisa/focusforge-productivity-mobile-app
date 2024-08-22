import { CompletionDate } from '@/app/entities';
import { calculateHabitCompletionMetrics } from '@/app/utils';
import { styled, View, Text } from 'tamagui';

interface Props {
  completionDates: CompletionDate[];
}

const CompletionMetricsInfoPanelModule = ({ completionDates }: Props) => {
  const { week, month, year, allTime } =
    calculateHabitCompletionMetrics(completionDates);

  const metrics = [
    { name: 'This week', value: week },
    { name: 'This month', value: month },
    { name: 'This year', value: year },
    { name: 'All', value: allTime },
  ];

  return (
    <Container>
      {metrics.map(({ name, value }, index) => (
        <MetricRow key={name} isFirstIndex={index === 0}>
          <Text color="$customGray1">{name}</Text>
          <Text>{value}</Text>
        </MetricRow>
      ))}
    </Container>
  );
};

const Container = styled(View, {
  marginTop: 12,
  paddingHorizontal: 12,
});

const MetricRow = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 8,
  paddingVertical: 6,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
  variants: {
    isFirstIndex: {
      true: {
        borderTopWidth: 1,
      },
      false: {
        borderTopWidth: 0,
      },
    },
  } as const,
});

export default CompletionMetricsInfoPanelModule;

import { BarGraphFilter } from '@/app/entities';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getTokenValue, styled, Text, View } from 'tamagui';
import ArrowLeftSvg from '../../icons/ArrowLeftSvg';
import ArrowRightSvg from '../../icons/ArrowRightSvg';

interface Props {
  barGraphFilter: BarGraphFilter;
  selectedYear: number;
  onYearChange: (direction: 'left' | 'right') => void;
}

const SVG_SIZE = 16;

const BarGraphPeriodSelector = ({
  barGraphFilter,
  selectedYear,
  onYearChange,
}: Props) => {
  const isFilterSetToMonth = barGraphFilter === 'month';

  const customRed2 = getTokenValue('$customRed2');

  return (
    <Container isContentCentered={!isFilterSetToMonth}>
      {isFilterSetToMonth && (
        <TouchableOpacity onPress={() => onYearChange('left')}>
          <ArrowLeftSvg fill={customRed2} size={SVG_SIZE} />
        </TouchableOpacity>
      )}

      <TextColumn>
        <YearText>{isFilterSetToMonth ? selectedYear : 'Yearly view'}</YearText>
        <HeadingText>Times completed</HeadingText>
      </TextColumn>

      {isFilterSetToMonth && (
        <TouchableOpacity onPress={() => onYearChange('right')}>
          <ArrowRightSvg fill={customRed2} size={SVG_SIZE} />
        </TouchableOpacity>
      )}
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  marginTop: 12,
  paddingHorizontal: 28,
  variants: {
    isContentCentered: {
      true: {
        justifyContent: 'center',
      },
      false: {
        justifyContent: 'space-between',
      },
    },
  } as const,
});

const TextColumn = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
});

const YearText = styled(Text, {
  fontWeight: 'bold',
  fontSize: 16,
});

const HeadingText = styled(Text, {
  color: '$customGray1',
});

export default BarGraphPeriodSelector;

import { CompletionDate } from '@/app/entities';
import useBarGraph from '@/app/hooks/useBarGraph';
import useCustomColors from '@/app/hooks/useCustomColors';
import { parseDate } from '@/app/utils';
import {
  LinearGradient,
  Text as SkiaText,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import { getYear } from 'date-fns';
import { useMemo } from 'react';
import { useDerivedValue } from 'react-native-reanimated';
import { styled, Text, View } from 'tamagui';
import { Bar, CartesianChart, useChartPressState } from 'victory-native';
import BarGraphPeriodSelector from './BarGraphPeriodSelector';

interface Props {
  completionDates: CompletionDate[];
}

// Helper functions to generate data

const generateMonthlyData = (
  completionDates: CompletionDate[],
  selectedYear: number
) => {
  // Initialize the data structure with all months and zero counts
  const monthlyData = [
    { xKey: 'Jan', timesCompleted: 0 },
    { xKey: 'Feb', timesCompleted: 0 },
    { xKey: 'Mar', timesCompleted: 0 },
    { xKey: 'Apr', timesCompleted: 0 },
    { xKey: 'May', timesCompleted: 0 },
    { xKey: 'Jun', timesCompleted: 0 },
    { xKey: 'Jul', timesCompleted: 0 },
    { xKey: 'Aug', timesCompleted: 0 },
    { xKey: 'Sep', timesCompleted: 0 },
    { xKey: 'Oct', timesCompleted: 0 },
    { xKey: 'Nov', timesCompleted: 0 },
    { xKey: 'Dec', timesCompleted: 0 },
  ];

  // Iterate over each completion date
  completionDates.forEach(({ date, isCompleted }) => {
    if (isCompleted) {
      // Extract the year and month from the date string
      const [dayStr, monthStr, yearStr] = date.split(' ');
      const year = parseInt(yearStr, 10);

      // Only consider the dates that match the selectedYear
      if (year === selectedYear) {
        // Find the corresponding month in the monthlyData array
        const monthIndex = parseDate(date).getMonth();
        if (monthIndex >= 0) {
          monthlyData[monthIndex].timesCompleted += 1;
        }
      }
    }
  });

  return monthlyData;
};

const generateYearlyData = (completionDates: CompletionDate[]) => {
  const currentYear = getYear(new Date());
  const yearRange = [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];

  const yearMap: Record<number, number> = yearRange.reduce(
    (acc, year) => ({ ...acc, [year]: 0 }),
    {}
  );

  completionDates.forEach(({ date, isCompleted }) => {
    if (isCompleted) {
      const year = getYear(parseDate(date));
      if (yearMap[year] !== undefined) {
        yearMap[year]++;
      }
    }
  });

  return yearRange.map((year) => ({
    xKey: year.toString(),
    timesCompleted: yearMap[year],
  }));
};

const CustomBarGraph = ({ completionDates }: Props) => {
  const font = useFont(require('@tamagui/font-inter/otf/Inter-Medium.otf'), 12);

  const {
    currentYear,
    selectedYear,
    barGraphFilter,
    handleYearChange,
    handleFilterSelect,
  } = useBarGraph();

  const { customGray2, customRed2, customRed3 } = useCustomColors();

  const { state, isActive } = useChartPressState({
    x: barGraphFilter === 'month' ? 'Jan' : (currentYear - 2).toString(),
    y: { timesCompleted: 0 },
  });

  const isFilterSetToMonth = barGraphFilter === 'month';
  const isFilterSetToYear = barGraphFilter === 'year';

  const data = useMemo(
    () =>
      barGraphFilter === 'month'
        ? generateMonthlyData(completionDates, selectedYear)
        : generateYearlyData(completionDates),
    [barGraphFilter, selectedYear, completionDates]
  );

  const value = useDerivedValue(
    () => state.y.timesCompleted.value.value.toString(),
    [state]
  );

  const textYPositon = useDerivedValue(
    () => state.y.timesCompleted.position.value - 5,
    [state]
  );

  const textXPositon = useDerivedValue(() => {
    if (!font) return 0;

    return state.x.position.value - font.measureText(value.value).width / 2;
  }, [state, font]);

  return (
    <Container>
      <BarGraphPeriodSelector
        barGraphFilter={barGraphFilter}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
      />
      <GraphContainer>
        <CartesianChart
          data={data}
          chartPressState={state}
          xKey={'xKey'}
          yKeys={['timesCompleted']}
          domainPadding={{ left: 30, right: 30, top: 30 }}
          axisOptions={{
            font,
            labelColor: { x: 'white', y: 'white' },
            lineColor: customGray2,
            lineWidth: 1,
            tickCount: { x: barGraphFilter === 'month' ? 12 : 5, y: 6 },
          }}
        >
          {({ points, chartBounds }) => (
            <>
              <Bar
                chartBounds={chartBounds}
                points={points.timesCompleted}
                barWidth={8}
              >
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, 400)}
                  colors={[customRed2, customRed3]}
                />
              </Bar>
              {isActive && (
                <SkiaText
                  font={font}
                  color="white"
                  x={textXPositon}
                  y={textYPositon}
                  text={value}
                />
              )}
            </>
          )}
        </CartesianChart>
      </GraphContainer>

      <Buttons>
        <Button
          animation="fast"
          isSelected={isFilterSetToMonth}
          onPress={() => handleFilterSelect('month')}
        >
          <ButtonText animation="fast" isSelected={isFilterSetToMonth}>
            Month
          </ButtonText>
        </Button>
        <Button
          animation="fast"
          isSelected={isFilterSetToYear}
          isLast
          onPress={() => handleFilterSelect('year')}
        >
          <ButtonText animation="fast" isSelected={isFilterSetToYear}>
            Year
          </ButtonText>
        </Button>
      </Buttons>
    </Container>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  gap: 28,
  marginTop: 12,
});

const GraphContainer = styled(View, {
  width: '100%',
  height: 180,
});

const Buttons = styled(View, {
  flexDirection: 'row',
  width: '65%',
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '$customGray2',
  overflow: 'hidden',
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: '50%',
  height: 36,
  borderColor: '$customGray2',
  borderRightWidth: 1,
  variants: {
    isLast: {
      true: {
        borderRightWidth: 0,
      },
    },
    isSelected: {
      true: {
        backgroundColor: '$customRed5',
      },
      false: {
        backgroundColor: '$customGray3',
      },
    },
  } as const,
});

const ButtonText = styled(Text, {
  variants: {
    isSelected: {
      true: {
        color: '$customRed1',
      },
      false: {
        color: '$customGray1',
      },
    },
  } as const,
});

export default CustomBarGraph;

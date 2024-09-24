import { CompletionDate } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import { Path, Text as SkiaText, useFont } from '@shopify/react-native-skia';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { styled, Text, View } from 'tamagui';
import { Pie, type PieSliceData, PolarChart, useSlicePath } from 'victory-native';

interface CustomPieChartProps {
  completionDates: CompletionDate[];
}

interface CustomPieSliceProps {
  slice: PieSliceData;
}

const CustomPieChart = ({ completionDates }: CustomPieChartProps) => {
  const { customGreen2, customRed2 } = useCustomColors();

  const rotation = useSharedValue(0);

  const totalEntries = completionDates.length;
  const completedEntries = completionDates.filter((entry) => entry.isCompleted).length;
  const failedEntries = totalEntries - completedEntries;

  const chartData = [
    {
      value: completedEntries,
      color: customGreen2,
      label: 'done',
    },
    {
      value: failedEntries,
      color: customRed2,
      label: 'failed',
    },
  ];

  const rotationGesture = Gesture.Rotation().onUpdate((event) => {
    rotation.value = event.rotation;
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}rad` }],
    };
  });

  return (
    <Container>
      <GestureDetector gesture={rotationGesture}>
        <AnimatedRotatableContainer style={animatedStyle}>
          <PolarChart
            data={chartData}
            labelKey="label"
            valueKey="value"
            colorKey="color"
          >
            <Pie.Chart innerRadius={42}>
              {({ slice }) => <CustomPieSlice slice={slice} />}
            </Pie.Chart>
          </PolarChart>
        </AnimatedRotatableContainer>
      </GestureDetector>
      <ChartLegend>
        <Row>
          <Circle backgroundColor="$customGreen2" />
          <Text>done</Text>
        </Row>
        <Row>
          <Circle backgroundColor="$customRed2" />
          <Text>failed</Text>
        </Row>
      </ChartLegend>
    </Container>
  );
};

const CustomPieSlice = ({ slice }: CustomPieSliceProps) => {
  const path1 = useSlicePath({
    slice: {
      ...slice,
      startAngle: slice.startAngle + 1,
      endAngle: slice.endAngle - 1,
    },
  });
  const path2 = useSlicePath({
    slice: {
      ...slice,
      radius: slice.innerRadius + 6,
    },
  });

  const font = useFont(require('@tamagui/font-inter/otf/Inter-Bold.otf'), 18);

  // Calculate the midpoint for the slice using the average of innerRadius and radius
  const angle = (slice.startAngle + slice.endAngle) / 2;
  const midpointRadius = (slice.innerRadius + slice.radius) / 2;
  const x = slice.center.x + midpointRadius * Math.cos((angle * Math.PI) / 180) - 8;
  const y = slice.center.y + midpointRadius * Math.sin((angle * Math.PI) / 180) + 4;

  return (
    <>
      <Path path={path1} color={slice.color} style="fill" />
      <Path path={path2} color="rgba(255, 255, 255, 0.5)" style="fill" />
      <SkiaText x={x} y={y} text={`${slice.value}`} color="white" font={font} />
    </>
  );
};

const Container = styled(View, {
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 12,
});

const RotatableContainer = styled(View, {
  width: 180,
  height: 180,
});

const ChartLegend = styled(View, {
  position: 'absolute',
  left: 12,
  bottom: 12,
});

const Row = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
});

const Circle = styled(View, {
  width: 12,
  height: 12,
  borderRadius: 6,
});

const AnimatedRotatableContainer = Animated.createAnimatedComponent(RotatableContainer);

export default CustomPieChart;

import { SCREEN_WIDTH } from '@/app/constants';
import { CompletionDate } from '@/app/entities';
import useCustomColors from '@/app/hooks/useCustomColors';
import { calculateHabitScore } from '@/app/utils';
import { useEffect, useMemo } from 'react';
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { Circle, Svg } from 'react-native-svg';

import { styled, View } from 'tamagui';

const CONTAINER_WIDTH = SCREEN_WIDTH;
const CONTAINER_HEIGHT = CONTAINER_WIDTH * 0.6;
const CIRCLE_RADIUS = CONTAINER_WIDTH / 4;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

interface Props {
  completionDates: CompletionDate[];
}

const CircularProgressBar = ({ completionDates }: Props) => {
  const { customGray2, customRed2 } = useCustomColors();

  const habitScore = useMemo(
    () => calculateHabitScore(completionDates),

    [completionDates]
  );

  const score = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_CIRCUMFERENCE * (1 - score.value),
  }));

  const scoreText = useDerivedValue(() => `${Math.floor(score.value * 100)}`);

  useEffect(() => {
    score.value = withTiming(habitScore, { duration: 2000 });
  }, [habitScore]);

  return (
    <Container>
      <Svg fill="none" style={{ position: 'absolute' }}>
        <Circle
          cx={CONTAINER_WIDTH / 2}
          cy={CONTAINER_HEIGHT / 2}
          r={CIRCLE_RADIUS}
          stroke={customGray2}
          strokeWidth={16}
        />
        <AnimatedCircle
          cx={CONTAINER_WIDTH / 2}
          cy={CONTAINER_HEIGHT / 2}
          r={CIRCLE_RADIUS}
          stroke={customRed2}
          strokeWidth={16}
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          strokeDashoffset={20}
          strokeLinecap="round"
          transform={`rotate(-90 ${CONTAINER_WIDTH / 2} ${CONTAINER_HEIGHT / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>
      <ReText
        style={{
          fontSize: CONTAINER_WIDTH * 0.145,
          fontWeight: 'bold',
          color: 'white',
        }}
        text={scoreText}
      />
    </Container>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: CONTAINER_WIDTH,
  height: CONTAINER_HEIGHT,
});

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default CircularProgressBar;

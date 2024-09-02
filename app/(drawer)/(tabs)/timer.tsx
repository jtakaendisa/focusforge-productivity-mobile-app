import CircularCarousel from '@/app/components/tabs/timer/CircularCarousel';
import { useCallback, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled, View } from 'tamagui';

const TimerScreen = () => {
  const [timerDuration, setTimerDuration] = useState(25);

  const timers = useMemo(() => [...Array(13).keys()].map((i) => i * 5).slice(1), []);

  const handleTimerDurationSelect = useCallback(
    (index: number) => setTimerDuration(timers[index]),
    []
  );

  return (
    <Container>
      <CircularCarousel timers={timers} onSelect={handleTimerDurationSelect} />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  backgroundColor: '$customBlack1',
});

export default TimerScreen;

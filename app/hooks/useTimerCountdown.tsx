import { useEffect, useState } from 'react';
import { Vibration } from 'react-native';
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const useTimerCountdown = (timerDuration: number) => {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isCountdownPaused, setIsCountdownPaused] = useState(false);

  const remainingTime = useSharedValue(0);

  const startCountdown = () => {
    Vibration.cancel();
    toggleIsCountingDown();

    remainingTime.value = withTiming(
      0,
      {
        duration: remainingTime.value * 1000,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) {
          runOnJS(Vibration.vibrate)();
          runOnJS(toggleIsCountingDown)();
          remainingTime.value = timerDuration * 60;
        }
      }
    );
  };

  const pauseCountdown = () => {
    toggleIsCountdownPaused();
    toggleIsCountingDown();
    cancelAnimation(remainingTime);
  };

  const resumeCountdown = () => {
    toggleIsCountdownPaused();
    startCountdown();
  };

  const resetCountdown = () => {
    setIsCountdownPaused(false);
    setIsCountingDown(false);
    remainingTime.value = timerDuration * 60;
  };

  const toggleIsCountingDown = () => setIsCountingDown((prev) => !prev);

  const toggleIsCountdownPaused = () => setIsCountdownPaused((prev) => !prev);

  useEffect(() => {
    remainingTime.value = timerDuration * 60;
  }, [timerDuration]);

  return {
    remainingTime,
    isCountingDown,
    isCountdownPaused,
    startCountdown,
    pauseCountdown,
    resumeCountdown,
    resetCountdown,
  };
};

export default useTimerCountdown;

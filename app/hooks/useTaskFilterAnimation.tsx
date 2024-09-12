import { useEffect } from 'react';
import {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { TaskFilter } from '../entities';
import useCustomColors from './useCustomColors';

const useTaskFilterAnimation = (taskFilter: TaskFilter) => {
  const { customGray1 } = useCustomColors();

  // Shared values for animation states
  const isSingleTaskSelected = useSharedValue(0);
  const isRecurringTaskSelected = useSharedValue(0);

  // Text color animation
  const textColorAnimation = (filter: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      color: interpolateColor(filter.value, [0, 1], [customGray1, 'white']),
    }));
  };

  // Indicator opacity animation
  const indicatorOpacityAnimation = (filter: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      opacity: interpolate(filter.value, [0, 1], [0, 1]),
    }));
  };

  // Update animations based on the selected filter
  useEffect(() => {
    if (taskFilter === 'single task') {
      isSingleTaskSelected.value = withTiming(1);
      isRecurringTaskSelected.value = withTiming(0);
    } else {
      isRecurringTaskSelected.value = withTiming(1);
      isSingleTaskSelected.value = withTiming(0);
    }
  }, [taskFilter]);

  return {
    isSingleTaskSelected,
    isRecurringTaskSelected,
    textColorAnimation,
    indicatorOpacityAnimation,
  };
};

export default useTaskFilterAnimation;

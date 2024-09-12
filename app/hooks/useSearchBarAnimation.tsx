import { useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const animationConfig = {
  duration: 350,
};

const useSearchBarAnimation = (headerHeight: number) => {
  const isSearchRowVisible = useSharedValue(0);

  const heightAnimation = useAnimatedStyle(() => ({
    height: isSearchRowVisible.value
      ? withTiming(headerHeight, animationConfig)
      : withTiming(0, animationConfig),
  }));

  const opacityAnimation = useAnimatedStyle(() => ({
    opacity: isSearchRowVisible.value
      ? withTiming(1, animationConfig)
      : withTiming(0, animationConfig),
  }));

  useEffect(() => {
    isSearchRowVisible.value = 1;
  }, []);

  return { heightAnimation, opacityAnimation };
};

export default useSearchBarAnimation;

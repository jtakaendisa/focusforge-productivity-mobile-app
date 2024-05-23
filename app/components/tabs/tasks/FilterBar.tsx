import { View, Text, styled } from 'tamagui';

import { useTaskStore } from '@/app/store';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const FilterBar = () => {
  const filter = useTaskStore((s) => s.filter);
  const setFilter = useTaskStore((s) => s.setFilter);

  const sharedFilter = useSharedValue(filter === 'single' ? 1 : 0);

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(sharedFilter.value, [0, 1], ['#8C8C8C', '#fff']),
  }));

  const textColorInverseAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(sharedFilter.value, [0, 1], ['#fff', '#8C8C8C']),
  }));

  const indicatorOpacityAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(sharedFilter.value, [0, 1], [0, 1]),
  }));

  const indicatorOpacityInverseAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(sharedFilter.value, [0, 1], [1, 0]),
  }));

  useEffect(() => {
    sharedFilter.value = filter === 'single' ? withTiming(1) : withTiming(0);
  }, [filter]);

  return (
    <Container>
      <Button onPress={() => setFilter('single')}>
        <TextContainer>
          <AnimatedButtonText style={textColorAnimation}>
            Single Tasks
          </AnimatedButtonText>
          <AnimatedSelectionIndicator style={indicatorOpacityAnimation} />
        </TextContainer>
      </Button>
      <Button onPress={() => setFilter('recurring')}>
        <TextContainer>
          <AnimatedButtonText style={textColorInverseAnimation}>
            Recurring Tasks
          </AnimatedButtonText>
          <AnimatedSelectionIndicator style={indicatorOpacityInverseAnimation} />
        </TextContainer>
      </Button>
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  height: 48,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const Button = styled(View, {
  alignItems: 'center',
  width: '50%',
});

const TextContainer = styled(View, {
  position: 'relative',
  justifyContent: 'center',
  height: '100%',
});

const ButtonText = styled(Text, {
  fontSize: 14,
});

const SelectionIndicator = styled(View, {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: '#C33756',
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
});

const AnimatedButtonText = Animated.createAnimatedComponent(ButtonText);
const AnimatedSelectionIndicator = Animated.createAnimatedComponent(SelectionIndicator);

export default FilterBar;

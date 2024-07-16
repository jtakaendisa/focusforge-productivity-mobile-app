import { useEffect } from 'react';
import { View, Text, styled, getTokenValue } from 'tamagui';

import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { TaskFilter } from '@/app/entities';

interface Props {
  filter: TaskFilter;
  onSelect: (filter: TaskFilter) => void;
}

const FilterBar = ({ filter, onSelect }: Props) => {
  const isSingleTaskSelected = useSharedValue(0);
  const isRecurringTaskSelected = useSharedValue(0);

  const customGray1 = getTokenValue('$customGray1');

  const textColorAnimation = (filter: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      color: interpolateColor(filter.value, [0, 1], [customGray1, 'white']),
    }));
  };

  const indicatorOpacityAnimation = (filter: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      opacity: interpolate(filter.value, [0, 1], [0, 1]),
    }));
  };

  useEffect(() => {
    if (filter === 'single') {
      isSingleTaskSelected.value = withTiming(1);
      isRecurringTaskSelected.value = withTiming(0);
    } else {
      isRecurringTaskSelected.value = withTiming(1);
      isSingleTaskSelected.value = withTiming(0);
    }
  }, [filter]);

  return (
    <Container>
      <Button onPress={() => onSelect('single')}>
        <TextContainer>
          <AnimatedButtonText style={textColorAnimation(isSingleTaskSelected)}>
            Single Tasks
          </AnimatedButtonText>
          <AnimatedSelectionIndicator
            style={indicatorOpacityAnimation(isSingleTaskSelected)}
          />
        </TextContainer>
      </Button>
      <Button onPress={() => onSelect('recurring')}>
        <TextContainer>
          <AnimatedButtonText style={textColorAnimation(isRecurringTaskSelected)}>
            Recurring Tasks
          </AnimatedButtonText>
          <AnimatedSelectionIndicator
            style={indicatorOpacityAnimation(isRecurringTaskSelected)}
          />
        </TextContainer>
      </Button>
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  height: 48,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
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
  backgroundColor: '$customRed2',
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
});

const AnimatedButtonText = Animated.createAnimatedComponent(ButtonText);
const AnimatedSelectionIndicator = Animated.createAnimatedComponent(SelectionIndicator);

export default FilterBar;

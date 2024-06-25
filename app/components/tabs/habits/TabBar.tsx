import { useEffect } from 'react';
import { View, Text, styled } from 'tamagui';

import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { HabitActiveTab } from '@/app/habitDetails';
import { TaskActiveTab } from '@/app/taskDetails';

interface Props {
  mode: 'habit' | 'task';
  activeTab: HabitActiveTab | TaskActiveTab;
  onSelect: (activeTab: HabitActiveTab | TaskActiveTab) => void;
}

const TabBar = ({ mode, activeTab, onSelect }: Props) => {
  const isCalendarSelected = useSharedValue(0);
  const isStatisticsSelected = useSharedValue(0);
  const isEditSelected = useSharedValue(0);

  const textColorAnimation = (activeTab: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      color: interpolateColor(activeTab.value, [0, 1], ['#8C8C8C', '#fff']),
    }));
  };

  const indicatorOpacityAnimation = (activeTab: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      opacity: interpolate(activeTab.value, [0, 1], [0, 1]),
    }));
  };

  useEffect(() => {
    switch (activeTab) {
      case 'calendar':
        isCalendarSelected.value = withTiming(1);
        isStatisticsSelected.value = withTiming(0);
        isEditSelected.value = withTiming(0);
        break;
      case 'statistics':
        isStatisticsSelected.value = withTiming(1);
        isCalendarSelected.value = withTiming(0);
        isEditSelected.value = withTiming(0);
        break;
      case 'edit':
        isEditSelected.value = withTiming(1);
        isCalendarSelected.value = withTiming(0);
        isStatisticsSelected.value = withTiming(0);
        break;
    }
  }, [activeTab]);

  return (
    <Container>
      <Button isHabit={mode === 'habit'} onPress={() => onSelect('calendar')}>
        <TextContainer>
          <AnimatedButtonText style={textColorAnimation(isCalendarSelected)}>
            Calendar
          </AnimatedButtonText>
          <AnimatedSelectionIndicator
            style={indicatorOpacityAnimation(isCalendarSelected)}
          />
        </TextContainer>
      </Button>
      {mode === 'habit' && (
        <Button isHabit={mode === 'habit'} onPress={() => onSelect('statistics')}>
          <TextContainer>
            <AnimatedButtonText style={textColorAnimation(isStatisticsSelected)}>
              Statistics
            </AnimatedButtonText>
            <AnimatedSelectionIndicator
              style={indicatorOpacityAnimation(isStatisticsSelected)}
            />
          </TextContainer>
        </Button>
      )}
      <Button isHabit={mode === 'habit'} onPress={() => onSelect('edit')}>
        <TextContainer>
          <AnimatedButtonText style={textColorAnimation(isEditSelected)}>
            Edit
          </AnimatedButtonText>
          <AnimatedSelectionIndicator
            style={indicatorOpacityAnimation(isEditSelected)}
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
  borderColor: '#262626',
});

const Button = styled(View, {
  alignItems: 'center',
  variants: {
    isHabit: {
      true: {
        width: '33.333%',
      },
      false: {
        width: '50%',
      },
    },
  } as const,
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

export default TabBar;

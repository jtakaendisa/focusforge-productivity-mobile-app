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

import { HabitActiveTab, TaskActiveTab } from '@/app/entities';
import RippleButton from '../RippleButton';

interface HabitProps {
  mode: 'habit';
  activeTab: HabitActiveTab;
  onSelect: (activeTab: HabitActiveTab) => void;
}

interface TaskProps {
  mode: 'task';
  activeTab: TaskActiveTab;
  onSelect: (activeTab: TaskActiveTab) => void;
}

type Props = HabitProps | TaskProps;

const TabBar = ({ mode, activeTab, onSelect }: Props) => {
  const isTaskMode = mode === 'task';

  const isCalendarSelected = useSharedValue(0);
  const isStatisticsSelected = useSharedValue(0);
  const isEditSelected = useSharedValue(0);

  const customGray1 = getTokenValue('$customGray1');

  const textColorAnimation = (activeTab: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      color: interpolateColor(activeTab.value, [0, 1], [customGray1, 'white']),
    }));
  };

  const indicatorOpacityAnimation = (activeTab: SharedValue<number>) => {
    return useAnimatedStyle(() => ({
      opacity: interpolate(activeTab.value, [0, 1], [0, 1]),
    }));
  };

  const selectCalendarTab = () => onSelect('calendar');

  const selectStatisticsTab = () => !isTaskMode && onSelect('statistics');

  const selectEditTab = () => onSelect('edit');

  useEffect(() => {
    const resetTabSelectionIndicators = () => {
      isCalendarSelected.value = withTiming(0);
      isStatisticsSelected.value = withTiming(0);
      isEditSelected.value = withTiming(0);
    };

    resetTabSelectionIndicators();

    switch (activeTab) {
      case 'calendar':
        isCalendarSelected.value = withTiming(1);
        break;
      case 'statistics':
        isStatisticsSelected.value = withTiming(1);
        break;
      case 'edit':
        isEditSelected.value = withTiming(1);
        break;
    }
  }, [activeTab]);

  return (
    <Container>
      <RippleButton flex onPress={selectCalendarTab}>
        <Button>
          <TextContainer>
            <AnimatedButtonText style={textColorAnimation(isCalendarSelected)}>
              Calendar
            </AnimatedButtonText>
            <AnimatedSelectionIndicator
              style={indicatorOpacityAnimation(isCalendarSelected)}
            />
          </TextContainer>
        </Button>
      </RippleButton>
      {mode === 'habit' && (
        <RippleButton flex onPress={selectStatisticsTab}>
          <Button>
            <TextContainer>
              <AnimatedButtonText style={textColorAnimation(isStatisticsSelected)}>
                Statistics
              </AnimatedButtonText>
              <AnimatedSelectionIndicator
                style={indicatorOpacityAnimation(isStatisticsSelected)}
              />
            </TextContainer>
          </Button>
        </RippleButton>
      )}
      <RippleButton flex onPress={selectEditTab}>
        <Button>
          <TextContainer>
            <AnimatedButtonText style={textColorAnimation(isEditSelected)}>
              Edit
            </AnimatedButtonText>
            <AnimatedSelectionIndicator
              style={indicatorOpacityAnimation(isEditSelected)}
            />
          </TextContainer>
        </Button>
      </RippleButton>
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

export default TabBar;

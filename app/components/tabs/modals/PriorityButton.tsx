import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, View, Text } from 'tamagui';

import { Priority } from '@/app/entities';

interface Props {
  priority: Priority;
  currentPriority: Priority;
  onChange: (...event: any[]) => void;
}

const PriorityButton = ({ priority, currentPriority, onChange }: Props) => {
  const isSelected = useSharedValue(priority === currentPriority ? 1 : 0);

  const backgroundColorAnimation = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(isSelected.value, [0, 1], ['#262626', '#C73A57']),
  }));

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(isSelected.value, [0, 1], ['#8C8C8C', '#fff']),
  }));

  useEffect(() => {
    isSelected.value = priority === currentPriority ? withTiming(1) : withTiming(0);
  }, [currentPriority]);

  return (
    <AnimatedContainer
      style={[
        { borderRightWidth: priority !== 'High' ? 1 : 0 },
        backgroundColorAnimation,
      ]}
      onPress={() => onChange(priority)}
    >
      <AnimatedText style={textColorAnimation}>{priority}</AnimatedText>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderColor: '#8C8C8C',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default PriorityButton;

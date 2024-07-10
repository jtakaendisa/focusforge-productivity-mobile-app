import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, View, Text, getTokenValue } from 'tamagui';

import { Priority } from '@/app/entities';

interface Props {
  priority: Priority;
  currentPriority: Priority;
  onChange?: (...event: any[]) => void;
}

const PriorityButton = ({ priority, currentPriority, onChange }: Props) => {
  const isSelected = useSharedValue(priority === currentPriority ? 1 : 0);

  const customGray1 = getTokenValue('$customGray1');
  const customGray2 = getTokenValue('$customGray2');
  const customRed1 = getTokenValue('$customRed1');

  const backgroundColorAnimation = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      isSelected.value,
      [0, 1],
      [customGray2, customRed1]
    ),
  }));

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(isSelected.value, [0, 1], [customGray1, 'white']),
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
      onPress={() => onChange?.(priority)}
    >
      <AnimatedText style={textColorAnimation}>{priority}</AnimatedText>
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderColor: '$customGray1',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default PriorityButton;

import useCustomColors from '@/app/hooks/useCustomColors';
import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { styled, Text, View } from 'tamagui';
import AlarmClockSvg from '../../icons/AlarmClockSvg';
import BellSvg from '../../icons/BellSvg';

interface Props {
  variant: 'notification' | 'alarm';
  isSelected: boolean;
  onSelect: () => void;
}

const ReminderButton = ({ variant, isSelected, onSelect }: Props) => {
  const { customGray1, customGray2, customRed1 } = useCustomColors();

  const sharedIsSelected = useSharedValue(isSelected ? 1 : 0);

  const backgroundColorAnimation = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      sharedIsSelected.value,
      [0, 1],
      [customGray2, customRed1]
    ),
  }));

  const textColorAnimation = useAnimatedStyle(() => ({
    color: interpolateColor(sharedIsSelected.value, [0, 1], [customGray1, 'white']),
  }));

  useEffect(() => {
    sharedIsSelected.value = isSelected ? withTiming(1) : withTiming(0);
  }, [isSelected]);

  return (
    <AnimatedContainer
      style={[
        { borderRightWidth: variant === 'notification' ? 1 : 0 },
        backgroundColorAnimation,
      ]}
      onPress={onSelect}
    >
      {variant === 'notification' ? (
        <>
          <BellSvg size={22} fill={isSelected ? 'white' : customGray1} />
          <AnimatedText style={textColorAnimation} fontSize={12}>
            notification
          </AnimatedText>
        </>
      ) : (
        <>
          <AlarmClockSvg size={22} fill={isSelected ? 'white' : customGray1} />
          <AnimatedText style={textColorAnimation} fontSize={12}>
            alarm
          </AnimatedText>
        </>
      )}
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  width: 110,
  paddingVertical: 8,
  borderColor: '$customGray1',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default ReminderButton;

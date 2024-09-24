import useCustomColors from '@/app/hooks/useCustomColors';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View, styled } from 'tamagui';
import CheckSvg from '../icons/CheckSvg';
import LockSvg from '../icons/LockSvg';

interface Props {
  isChecked: SharedValue<number>;
  isDisabled?: boolean;
}

const CircularCheckbox = ({ isChecked, isDisabled }: Props) => {
  const { customGray1, customGreen1 } = useCustomColors();

  const checkboxAnimation = useAnimatedStyle(() => ({
    borderColor: interpolateColor(isChecked.value, [0, 1], [customGray1, customGreen1]),
    backgroundColor: interpolateColor(
      isChecked.value,
      [0, 1],
      ['transparent', customGreen1]
    ),
  }));

  const checkboxIconAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(isChecked.value, [0, 1], [0, 1]),
  }));

  return (
    <AnimatedContainer style={checkboxAnimation}>
      {isDisabled ? (
        <LockSvg size={10} fill={customGray1} />
      ) : (
        <AnimatedIconContainer style={checkboxIconAnimation}>
          <CheckSvg size={10} />
        </AnimatedIconContainer>
      )}
    </AnimatedContainer>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 26,
  height: 26,
  borderRadius: 13,
  borderWidth: 2,
});

const IconContainer = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
});

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedIconContainer = Animated.createAnimatedComponent(IconContainer);

export default CircularCheckbox;

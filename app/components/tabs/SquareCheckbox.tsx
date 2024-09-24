import useCustomColors from '@/app/hooks/useCustomColors';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View, styled } from 'tamagui';
import CheckSvg from '../icons/CheckSvg';

interface Props {
  isChecked: SharedValue<number>;
}

const SquareCheckbox = ({ isChecked }: Props) => {
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
    <AnimatedCheckbox style={checkboxAnimation}>
      <AnimatedCheckboxIcon style={checkboxIconAnimation}>
        <CheckSvg size={8} />
      </AnimatedCheckboxIcon>
    </AnimatedCheckbox>
  );
};

const CheckboxCircle = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 20,
  height: 20,
  borderRadius: 4,
  borderWidth: 2,
  borderColor: '$customGray1',
});

const CheckboxIcon = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
});

const AnimatedCheckbox = Animated.createAnimatedComponent(CheckboxCircle);
const AnimatedCheckboxIcon = Animated.createAnimatedComponent(CheckboxIcon);

export default SquareCheckbox;

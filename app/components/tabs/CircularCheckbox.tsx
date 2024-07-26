import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View, getTokenValue, styled } from 'tamagui';
import CheckSvg from '../icons/CheckSvg';

interface Props {
  isChecked: SharedValue<number>;
}

const CircularCheckbox = ({ isChecked }: Props) => {
  const customGray1 = getTokenValue('$customGray1');
  const customGreen1 = getTokenValue('$customGreen1');

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
        <CheckSvg size={10} />
      </AnimatedCheckboxIcon>
    </AnimatedCheckbox>
  );
};

const CheckboxCircle = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  width: 26,
  height: 26,
  borderRadius: 13,
  borderWidth: 2,
  borderColor: '$customGray1',
});

const CheckboxIcon = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
});

const AnimatedCheckbox = Animated.createAnimatedComponent(CheckboxCircle);
const AnimatedCheckboxIcon = Animated.createAnimatedComponent(CheckboxIcon);

export default CircularCheckbox;

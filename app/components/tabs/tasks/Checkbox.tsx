import Svg, { Path } from 'react-native-svg';
import Animated, {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View, getTokens, styled } from 'tamagui';

interface Props {
  sharedIsCompleted: SharedValue<number>;
}

const Checkbox = ({ sharedIsCompleted }: Props) => {
  const gray = getTokens().color.$gray1.val;
  const green = getTokens().color.$green1.val;

  const checkboxAnimation = useAnimatedStyle(() => ({
    borderColor: interpolateColor(sharedIsCompleted.value, [0, 1], [gray, green]),
    backgroundColor: interpolateColor(
      sharedIsCompleted.value,
      [0, 1],
      ['transparent', green]
    ),
  }));

  const checkboxIconAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(sharedIsCompleted.value, [0, 1], [0, 1]),
  }));

  return (
    <AnimatedCheckbox style={checkboxAnimation}>
      <AnimatedCheckboxIcon style={checkboxIconAnimation}>
        <Svg width="10" height="8" viewBox="0 0 10 8" fill="none">
          <Path
            d="M9.79076 0.20924C10.0697 0.488227 10.0697 0.941301 9.79076 1.22029L4.07711 6.93394C3.79813 7.21292 3.34505 7.21292 3.06606 6.93394L0.20924 4.07711C-0.0697467 3.79813 -0.0697467 3.34505 0.20924 3.06606C0.488227 2.78708 0.941301 2.78708 1.22029 3.06606L3.5727 5.41625L8.78194 0.20924C9.06093 -0.0697467 9.51401 -0.0697467 9.79299 0.20924H9.79076Z"
            fill="#fff"
          />
        </Svg>
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
  borderColor: '#8C8C8C',
});

const CheckboxIcon = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
});

const AnimatedCheckbox = Animated.createAnimatedComponent(CheckboxCircle);
const AnimatedCheckboxIcon = Animated.createAnimatedComponent(CheckboxIcon);

export default Checkbox;

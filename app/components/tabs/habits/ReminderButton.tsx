import { useEffect } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { styled, View, Text, getTokenValue } from 'tamagui';

interface Props {
  variant: 'notification' | 'alarm';
  isSelected: boolean;
  onSelect: () => void;
}

const ReminderButton = ({ variant, isSelected, onSelect }: Props) => {
  const sharedIsSelected = useSharedValue(isSelected ? 1 : 0);

  const customGray1 = getTokenValue('$customGray1');
  const customGray2 = getTokenValue('$customGray2');
  const customRed1 = getTokenValue('$customRed1');

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
          <Svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <Path
              d="M8.9375 0.6875C8.9375 0.309375 9.24688 0 9.625 0C10.0031 0 10.3125 0.309375 10.3125 0.6875V1.40937C13.7887 1.75312 16.5 4.68359 16.5 8.25V9.50039C16.5 11.3781 17.2477 13.1785 18.5754 14.5105L18.6957 14.6309C19.0523 14.9875 19.2543 15.473 19.2543 15.9758C19.2543 17.0285 18.4035 17.8793 17.3508 17.8793H1.90352C0.850781 17.875 0 17.0242 0 15.9715C0 15.4688 0.201953 14.9832 0.558594 14.6266L0.678906 14.5063C2.00234 13.1785 2.75 11.3781 2.75 9.50039V8.25C2.75 4.68359 5.46133 1.75312 8.9375 1.40937V0.6875ZM9.625 2.75C6.58711 2.75 4.125 5.21211 4.125 8.25V9.50039C4.125 11.7434 3.23555 13.8961 1.6457 15.4816L1.52969 15.5977C1.43086 15.6965 1.375 15.8297 1.375 15.9715C1.375 16.2637 1.61133 16.5 1.90352 16.5H17.3465C17.6387 16.5 17.875 16.2637 17.875 15.9715C17.875 15.8297 17.8191 15.6965 17.7203 15.5977L17.6 15.4773C16.0145 13.8918 15.1207 11.7391 15.1207 9.49609V8.25C15.1207 5.21211 12.6586 2.75 9.6207 2.75H9.625ZM8.32734 19.7098C8.51641 20.2426 9.02774 20.625 9.625 20.625C10.2223 20.625 10.7336 20.2426 10.9227 19.7098C11.0473 19.3531 11.4426 19.1641 11.7992 19.2887C12.1559 19.4133 12.3449 19.8086 12.2203 20.1652C11.8422 21.2352 10.8238 22 9.625 22C8.42617 22 7.40781 21.2352 7.02969 20.1652C6.90508 19.8086 7.08984 19.4133 7.45078 19.2887C7.81172 19.1641 8.20274 19.3488 8.32734 19.7098Z"
              fill={isSelected ? 'white' : customGray1}
            />
          </Svg>
          <AnimatedText style={textColorAnimation} fontSize={12}>
            notification
          </AnimatedText>
        </>
      ) : (
        <>
          <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <Path
              d="M6.87433 1.0913C6.14393 0.41246 5.16434 0 4.09023 0C1.83029 0 0 1.83029 0 4.09023C0 4.89796 0.236305 5.64984 0.640172 6.28571L6.87433 1.0913ZM10.9989 4.81203C13.0044 4.81203 14.9278 5.60871 16.3459 7.02682C17.764 8.44492 18.5607 10.3683 18.5607 12.3738C18.5607 14.3793 17.764 16.3027 16.3459 17.7208C14.9278 19.1389 13.0044 19.9356 10.9989 19.9356C8.99342 19.9356 7.07006 19.1389 5.65195 17.7208C4.23385 16.3027 3.43716 14.3793 3.43716 12.3738C3.43716 10.3683 4.23385 8.44492 5.65195 7.02682C7.07006 5.60871 8.99342 4.81203 10.9989 4.81203ZM10.9989 21.9979C13.2846 21.9979 15.3856 21.1987 17.0354 19.8711L18.8614 21.6971C19.2653 22.101 19.9184 22.101 20.3179 21.6971C20.7175 21.2932 20.7218 20.6402 20.3179 20.2406L18.4919 18.4146C19.8238 16.7648 20.6187 14.6638 20.6187 12.3781C20.623 7.05908 16.3136 2.74973 10.9989 2.74973C5.68421 2.74973 1.37487 7.05908 1.37487 12.3738C1.37487 14.6595 2.17401 16.7605 3.50161 18.4103L1.67562 20.2363C1.27175 20.6402 1.27175 21.2932 1.67562 21.6928C2.07948 22.0924 2.73255 22.0967 3.13212 21.6928L4.95811 19.8668C6.60795 21.1987 8.70892 21.9936 10.9946 21.9936L10.9989 21.9979ZM21.3577 6.29001C21.7615 5.65414 21.9979 4.89796 21.9979 4.09023C21.9979 1.83029 20.1676 0 17.9076 0C16.8335 0 15.8539 0.41246 15.1235 1.0913L21.3577 6.29001ZM12.0301 7.90548C12.0301 7.33405 11.5704 6.87433 10.9989 6.87433C10.4275 6.87433 9.96778 7.33405 9.96778 7.90548V12.3738C9.96778 12.6488 10.0752 12.9108 10.2685 13.1042L12.3308 15.1665C12.7347 15.5704 13.3878 15.5704 13.7873 15.1665C14.1869 14.7626 14.1912 14.1096 13.7873 13.71L12.0258 11.9484V7.90548H12.0301Z"
              fill={isSelected ? 'white' : customGray1}
            />
          </Svg>
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

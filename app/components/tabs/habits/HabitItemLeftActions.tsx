import { StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AnimatedInterpolation } from '@/app/entities';
import { getTokenValue } from 'tamagui';

interface Props {
  dragAnimatedValue: AnimatedInterpolation;
}

const SVG_SIZE = 24;

const HabitItemLeftActions = ({ dragAnimatedValue }: Props) => {
  const dragAnimation = {
    transform: [
      {
        translateX: dragAnimatedValue.interpolate({
          inputRange: [0, 50],
          outputRange: [-50, 0],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const customRed2 = getTokenValue('$customRed2');

  return (
    <Animated.View style={[styles.icon, dragAnimation]}>
      <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 22 22" fill="none">
        <Path
          d="M20.475 0.713109C19.5242 -0.237703 17.9873 -0.237703 17.0365 0.713109L15.7296 2.01559L19.9801 6.26602L21.2869 4.9592C22.2377 4.00839 22.2377 2.47146 21.2869 1.52065L20.475 0.713109ZM7.48493 10.2646C7.22009 10.5295 7.01603 10.8551 6.89881 11.2155L5.6137 15.0708C5.48779 15.4442 5.58765 15.8566 5.86551 16.1388C6.14337 16.421 6.55582 16.5166 6.93354 16.3906L10.7889 15.1055C11.1449 14.9883 11.4705 14.7843 11.7397 14.5194L19.0032 7.25157L14.7484 2.99679L7.48493 10.2646ZM4.16794 2.54961C1.86689 2.54961 0 4.4165 0 6.71755V17.8321C0 20.1331 1.86689 22 4.16794 22H15.2825C17.5835 22 19.4504 20.1331 19.4504 17.8321V13.6641C19.4504 12.8957 18.8295 12.2748 18.0611 12.2748C17.2926 12.2748 16.6718 12.8957 16.6718 13.6641V17.8321C16.6718 18.6005 16.0509 19.2214 15.2825 19.2214H4.16794C3.39948 19.2214 2.77863 18.6005 2.77863 17.8321V6.71755C2.77863 5.94908 3.39948 5.32824 4.16794 5.32824H8.33588C9.10435 5.32824 9.7252 4.70739 9.7252 3.93892C9.7252 3.17046 9.10435 2.54961 8.33588 2.54961H4.16794Z"
          fill={customRed2}
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});

export default HabitItemLeftActions;

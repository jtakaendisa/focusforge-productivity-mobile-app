import { StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AnimatedInterpolation } from '@/app/entities';

interface Props {
  dragAnimatedValue: AnimatedInterpolation;
}

const SVG_SIZE = 20;

const TaskItemLeftActions = ({ dragAnimatedValue }: Props) => {
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

  return (
    <Animated.View style={[styles.bin, dragAnimation]}>
      <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 20 22" fill="none">
        <Path
          d="M2.75 1.375C2.75 0.614453 2.13555 0 1.375 0C0.614453 0 0 0.614453 0 1.375V2.75V15.8125V20.625C0 21.3855 0.614453 22 1.375 22C2.13555 22 2.75 21.3855 2.75 20.625V15.125L5.51289 14.4332C7.27891 13.9906 9.14805 14.1969 10.7766 15.009C12.6758 15.9586 14.8801 16.0746 16.8652 15.327L18.3563 14.7684C18.8934 14.5664 19.25 14.0551 19.25 13.4793V2.84023C19.25 1.85195 18.2102 1.20742 17.325 1.65L16.9125 1.85625C14.923 2.85313 12.5812 2.85313 10.5918 1.85625C9.08359 1.1 7.35195 0.910938 5.71484 1.31914L2.75 2.0625V1.375Z"
          fill="white"
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bin: {
    backgroundColor: '#C33756',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default TaskItemLeftActions;

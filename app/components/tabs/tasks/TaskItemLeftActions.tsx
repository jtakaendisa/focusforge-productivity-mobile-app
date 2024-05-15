import { StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { AnimatedInterpolation } from '@/app/entities';

interface Props {
  dragAnimatedValue: AnimatedInterpolation;
}

const SVG_SIZE = 22;

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
      <Svg width={SVG_SIZE} height={SVG_SIZE} viewBox="0 0 22 22" fill="none">
        <Path
          d="M9.78398 0.502734C10.4543 -0.167578 11.5414 -0.167578 12.216 0.502734L21.4973 9.78398C22.1676 10.4543 22.1676 11.5414 21.4973 12.216L12.216 21.4973C11.5457 22.1676 10.4586 22.1676 9.78398 21.4973L0.502734 12.216C-0.167578 11.5457 -0.167578 10.4586 0.502734 9.78398L9.78398 0.502734ZM11 5.5C10.4285 5.5 9.96875 5.95977 9.96875 6.53125V11.3438C9.96875 11.9152 10.4285 12.375 11 12.375C11.5715 12.375 12.0312 11.9152 12.0312 11.3438V6.53125C12.0312 5.95977 11.5715 5.5 11 5.5ZM12.375 15.125C12.375 14.7603 12.2301 14.4106 11.9723 14.1527C11.7144 13.8949 11.3647 13.75 11 13.75C10.6353 13.75 10.2856 13.8949 10.0277 14.1527C9.76987 14.4106 9.625 14.7603 9.625 15.125C9.625 15.4897 9.76987 15.8394 10.0277 16.0973C10.2856 16.3551 10.6353 16.5 11 16.5C11.3647 16.5 11.7144 16.3551 11.9723 16.0973C12.2301 15.8394 12.375 15.4897 12.375 15.125Z"
          fill="#fff"
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

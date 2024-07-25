import { StyleSheet, Animated } from 'react-native';

import { AnimatedInterpolation } from '@/app/entities';
import FlagSvg from '../../icons/FlagSvg';
import PenToSquareSvg from '../../icons/PenToSquareSvg';

interface Props {
  dragAnimatedValue: AnimatedInterpolation;
  isCheckable?: boolean;
}

const TaskItemLeftActions = ({ dragAnimatedValue, isCheckable }: Props) => {
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
    <Animated.View style={[styles.icon, dragAnimation]}>
      {isCheckable ? <FlagSvg /> : <PenToSquareSvg />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  icon: {
    backgroundColor: '#C33756',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
});

export default TaskItemLeftActions;

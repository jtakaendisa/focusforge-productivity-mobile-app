import { StyleSheet, Animated } from 'react-native';

import { AnimatedInterpolation } from '@/app/entities';
import BinSvg from '../../icons/BinSvg';

interface Props {
  dragAnimatedValue: AnimatedInterpolation;
}

const TaskItemRightActions = ({ dragAnimatedValue }: Props) => {
  const dragAnimation = {
    transform: [
      {
        translateX: dragAnimatedValue.interpolate({
          inputRange: [-50, 0],
          outputRange: [0, 50],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  return (
    <Animated.View style={[styles.bin, dragAnimation]}>
      <BinSvg />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bin: {
    backgroundColor: '#C33756',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});

export default TaskItemRightActions;

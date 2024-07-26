import { Animated, StyleSheet } from 'react-native';

import { AnimatedInterpolation } from '@/app/entities';
import { getTokenValue } from 'tamagui';
import BinSvg from '../../icons/BinSvg';

interface Props {
  dragAnimatedValue: AnimatedInterpolation;
}

const HabitItemRightActions = ({ dragAnimatedValue }: Props) => {
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

  const customRed2 = getTokenValue('$customRed2');

  return (
    <Animated.View style={[styles.bin, dragAnimation]}>
      <BinSvg size={24} fill={customRed2} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bin: {
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
});

export default HabitItemRightActions;

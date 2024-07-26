import { Animated, StyleSheet } from 'react-native';

import { AnimatedInterpolation } from '@/app/entities';
import { getTokenValue } from 'tamagui';
import PenToSquareSvg from '../../icons/PenToSquareSvg';

interface Props {
  dragAnimatedValue: AnimatedInterpolation;
}

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
      <PenToSquareSvg size={24} fill={customRed2} />
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

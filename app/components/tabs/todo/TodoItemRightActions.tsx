import { View, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AnimatedInterpolation } from '@/app/entities';

interface Props {
  progressAnimatedValue: AnimatedInterpolation;
  dragAnimatedValue: AnimatedInterpolation;
  id: number;
  onDelete: (id: number) => void;
}

const TodoItemRightActions = ({
  progressAnimatedValue,
  dragAnimatedValue,
  id,
  onDelete,
}: Props) => {
  const dragAnimation = {
    transform: [
      {
        translateX: dragAnimatedValue.interpolate({
          inputRange: [-40, 0],
          outputRange: [0, 40],
          extrapolate: 'clamp',
        }),
      },
    ],
  };

  const AnimatedContainer = Animated.createAnimatedComponent(View);

  return (
    <AnimatedContainer style={[styles.bin, dragAnimation]}>
      <MaterialCommunityIcons
        onPress={() => onDelete(id)}
        name="delete"
        size={24}
        color="white"
      />
    </AnimatedContainer>
  );
};

const styles = StyleSheet.create({
  bin: {
    backgroundColor: 'crimson',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

export default TodoItemRightActions;

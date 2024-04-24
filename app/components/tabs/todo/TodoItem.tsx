import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';

import { Todo } from '@/app/entities';
import TodoItemRightActions from './TodoItemRightActions';
import { TaskContainer, Title } from './styled';

interface Props {
  todo: Todo;
  onPress: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ todo, onPress, onDelete }: Props) => {
  const { id, title, isFinished } = todo;

  return (
    <Animated.View entering={FadeInLeft} exiting={FadeOutLeft}>
      <Swipeable
        renderRightActions={(progressAnimatedValue, dragAnimatedValue) => (
          <TodoItemRightActions
            progressAnimatedValue={progressAnimatedValue}
            dragAnimatedValue={dragAnimatedValue}
            id={id}
            onDelete={onDelete}
          />
        )}
      >
        <Pressable onPress={() => onPress(id)}>
          <TaskContainer>
            <MaterialCommunityIcons
              name={
                isFinished
                  ? 'checkbox-marked-circle-outline'
                  : 'checkbox-blank-circle-outline'
              }
              size={24}
              color={isFinished ? 'green' : 'dimgray'}
            />
            <Title isFinished={isFinished}>{title}</Title>
          </TaskContainer>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
};

export default TodoItem;

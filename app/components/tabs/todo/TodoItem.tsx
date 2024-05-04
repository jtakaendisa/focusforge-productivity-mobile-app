import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInLeft, FadeOutLeft } from 'react-native-reanimated';

import { Todo } from '@/app/entities';
import TodoItemRightActions from './TodoItemRightActions';
import { TaskContainer, Title } from './styled';

interface Props {
  todo: Todo;
  onPress: (id: string) => void;
  onDelete: (id: string) => void;
}

const TodoItem = ({ todo, onPress, onDelete }: Props) => {
  const { id, task, isCompleted } = todo;

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
                isCompleted
                  ? 'checkbox-marked-circle-outline'
                  : 'checkbox-blank-circle-outline'
              }
              size={24}
              color={isCompleted ? 'green' : 'dimgray'}
            />
            <Title isCompleted={isCompleted}>{task}</Title>
          </TaskContainer>
        </Pressable>
      </Swipeable>
    </Animated.View>
  );
};

export default TodoItem;

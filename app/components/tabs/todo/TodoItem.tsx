import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';

import { Todo } from '@/app/entities';
import TodoItemRightActions from './TodoItemRightActions';
import { TaskContainer, Title } from './styled';

interface Props {
  todo: Todo;
  onPress: (index: number) => void;
}

const TodoItem = ({ todo, onPress }: Props) => {
  const { id, title, isFinished } = todo;

  return (
    <Swipeable
      renderRightActions={(progressAnimatedValue, dragAnimatedValue) => (
        <TodoItemRightActions
          progressAnimatedValue={progressAnimatedValue}
          dragAnimatedValue={dragAnimatedValue}
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
  );
};

export default TodoItem;

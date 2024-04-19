import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Todo } from '@/app/entities';
import { TaskContainer, Title } from './styled';

interface Props {
  todo: Todo;
  onPress: (index: number) => void;
}

const TodoItem = ({ todo, onPress }: Props) => {
  const { id, title, isFinished } = todo;

  return (
    <Pressable onPress={() => onPress(id)}>
      <TaskContainer>
        <MaterialCommunityIcons
          name={
            isFinished
              ? 'checkbox-marked-circle-outline'
              : 'checkbox-blank-circle-outline'
          }
          size={24}
          color="dimgray"
        />
        <Title style={{ textDecorationLine: isFinished ? 'line-through' : 'none' }}>
          {title}
        </Title>
      </TaskContainer>
    </Pressable>
  );
};

export default TodoItem;

import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';

import { Todo } from '@/app/entities';
import { Input, TaskContainer } from './styled';

interface Props {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

const CreateTodoItem = ({ todos, setTodos }: Props) => {
  const [newTodo, setNewTodo] = useState('');

  const handleTodoSubmit = () => {
    if (!newTodo.length) return;

    const newFormattedTodo = {
      id: uuid.v4() as string,
      task: newTodo,
      isCompleted: false,
    };
    const updatedTodos = [...todos, newFormattedTodo];

    setTodos(updatedTodos);
    setNewTodo('');
  };

  return (
    <TaskContainer>
      <MaterialCommunityIcons
        name={'checkbox-blank-circle-outline'}
        size={24}
        color="dimgray"
      />
      <Input
        placeholder="Create Todo..."
        value={newTodo}
        onChangeText={setNewTodo}
        onEndEditing={handleTodoSubmit}
      />
    </TaskContainer>
  );
};

export default CreateTodoItem;

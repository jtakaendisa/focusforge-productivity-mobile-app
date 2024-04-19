import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTodoStore } from '@/app/store';
import { Input, TaskContainer } from './styled';

interface Props {
  listLength: number;
}

const CreateTodoItem = ({ listLength }: Props) => {
  const addTodo = useTodoStore((s) => s.addTodo);

  const [newTodo, setNewTodo] = useState('');

  const handleTodoSubmit = () => {
    const newFormattedTodo = {
      id: listLength,
      title: newTodo,
      isFinished: false,
    };

    addTodo(newFormattedTodo);
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

import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useTodoStore } from '@/app/store';
import { Input, TaskContainer } from './styled';
import { Todo } from '@/app/entities';

interface Props {
  todos: Todo[];
}

const CreateTodoItem = ({ todos }: Props) => {
  const setTodos = useTodoStore((s) => s.setTodos);

  const [newTodo, setNewTodo] = useState('');

  const handleTodoSubmit = () => {
    if (!newTodo.length) return;

    const newFormattedTodo = {
      id: todos.length,
      title: newTodo,
      isFinished: false,
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

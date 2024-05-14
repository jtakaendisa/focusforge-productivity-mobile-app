import { MutableRefObject } from 'react';
import { FlashList } from '@shopify/flash-list';

import { Todo } from '@/app/entities';
import { useTodoStore } from '@/app/store';
import TodoItem from '../tasks/TodoItem';

interface Props {
  taskListRef: MutableRefObject<FlashList<Todo> | null>;
  todos: Todo[];
  filteredTasks: Todo[];
}

const TaskList = ({ taskListRef, todos, filteredTasks }: Props) => {
  const setTodos = useTodoStore((s) => s.setTodos);

  const handleTaskPress = (id: string) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const handleTaskDelete = (id: string) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
    taskListRef.current?.prepareForLayoutAnimationRender();
  };

  return (
    <FlashList
      ref={taskListRef}
      data={filteredTasks}
      renderItem={({ item }) => (
        <TodoItem todo={item} onPress={handleTaskPress} onDelete={handleTaskDelete} />
      )}
      keyExtractor={(item) => item.id}
      estimatedItemSize={20}
    />
  );
};

export default TaskList;

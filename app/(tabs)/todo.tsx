import { FlatList } from 'react-native';

import { useTodoStore } from '../store';
import TodoItem from '../components/tabs/todo/TodoItem';
import CreateTodoItem from '../components/tabs/todo/CreateTodoItem';
import { Container } from '../components/tabs/todo/styled';

const TodoScreen = () => {
  const todos = useTodoStore((s) => s.todos);
  const setTodos = useTodoStore((s) => s.setTodos);

  const handleTaskPress = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            isFinished: !todo.isFinished,
          }
        : todo
    );
    setTodos(updatedTodos);
  };

  return (
    <Container>
      <FlatList
        data={todos}
        renderItem={({ item }) => <TodoItem todo={item} onPress={handleTaskPress} />}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ gap: 6 }}
        ListHeaderComponent={<CreateTodoItem listLength={todos.length} />}
      />
    </Container>
  );
};

export default TodoScreen;

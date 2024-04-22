import { FlashList } from '@shopify/flash-list';

import { useTodoStore } from '../store';
import TodoItem from '../components/tabs/todo/TodoItem';
import CreateTodoItem from '../components/tabs/todo/CreateTodoItem';
import { Container, ItemSeparator } from '../components/tabs/todo/styled';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const TodoScreen = () => {
  const todos = useTodoStore((s) => s.todos);
  const setTodos = useTodoStore((s) => s.setTodos);

  const handleTaskPress = (id: number) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isFinished: !todo.isFinished,
        };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  return (
    <Container>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlashList
          data={todos}
          renderItem={({ item }) => <TodoItem todo={item} onPress={handleTaskPress} />}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparator}
          estimatedItemSize={20}
          ListHeaderComponent={() => <CreateTodoItem listLength={todos.length} />}
          contentContainerStyle={{ padding: 10 }}
        />
      </GestureHandlerRootView>
    </Container>
  );
};

export default TodoScreen;

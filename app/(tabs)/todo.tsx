import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTodoStore } from '../store';
import TodoItem from '../components/tabs/todo/TodoItem';
import CreateTodoItem from '../components/tabs/todo/CreateTodoItem';
import { Container, ItemSeparator } from '../components/tabs/todo/styled';
import SearchBar from '../components/tabs/todo/SearchBar';
import { useEffect, useState } from 'react';

const TodoScreen = () => {
  const todos = useTodoStore((s) => s.todos);
  const searchQuery = useTodoStore((s) => s.searchQuery);
  const setTodos = useTodoStore((s) => s.setTodos);

  const [filteredTodos, setFilteredTodos] = useState(todos);

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

  const handleTaskDelete = (id: number) => {
    const filteredTodos = todos.filter((todo) => todo.id !== id);
    setTodos(filteredTodos);
  };

  useEffect(() => {
    if (searchQuery.length) {
      const filteredTodos = todos.filter((todo) =>
        todo.title.toLowerCase().includes(searchQuery)
      );
      setFilteredTodos(filteredTodos);
    } else {
      setFilteredTodos(todos);
    }
  }, [searchQuery, todos]);

  return (
    <Container>
      <SearchBar />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlashList
          data={filteredTodos}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onPress={handleTaskPress}
              onDelete={handleTaskDelete}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={ItemSeparator}
          estimatedItemSize={20}
          ListHeaderComponent={() => <CreateTodoItem todos={todos} />}
          contentContainerStyle={{ padding: 10 }}
        />
      </GestureHandlerRootView>
    </Container>
  );
};

export default TodoScreen;

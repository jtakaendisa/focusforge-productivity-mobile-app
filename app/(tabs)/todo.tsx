import { useEffect, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useTodoStore } from '../store';
import CreateTodoItem from '../components/tabs/todo/CreateTodoItem';
import TodoItem from '../components/tabs/todo/TodoItem';
import SearchBar from '../components/tabs/todo/SearchBar';
import FilterBar from '../components/tabs/todo/FilterBar';
import { Container, ItemSeparator } from '../components/tabs/todo/styled';

const TodoScreen = () => {
  const todos = useTodoStore((s) => s.todos);
  const searchQuery = useTodoStore((s) => s.searchQuery);
  const filter = useTodoStore((s) => s.filter);
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

  useEffect(() => {
    let filteredTodos;

    switch (filter) {
      case 'all':
        filteredTodos = todos;
        break;
      case 'open':
        filteredTodos = todos.filter((todo) => todo.isFinished === false);
        break;
      case 'finished':
        filteredTodos = todos.filter((todo) => todo.isFinished === true);
        break;
      default:
        filteredTodos = todos;
        break;
    }

    setFilteredTodos(filteredTodos);
  }, [filter, todos]);

  return (
    <Container>
      <SearchBar />
      <FilterBar />
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

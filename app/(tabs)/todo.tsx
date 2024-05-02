import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { View, Text, styled } from 'tamagui';

import { Todo } from '../entities';
import { useTodoStore } from '../store';
import CreateTodoItem from '../components/tabs/todo/CreateTodoItem';
import TodoItem from '../components/tabs/todo/TodoItem';
import SearchBar from '../components/tabs/todo/SearchBar';
import FilterBar from '../components/tabs/todo/FilterBar';
import FrequencySelector from '../components/tabs/todo/FrequencySelector';

const TodoScreen = () => {
  const todos = useTodoStore((s) => s.todos);
  const searchQuery = useTodoStore((s) => s.searchQuery);
  const filter = useTodoStore((s) => s.filter);
  const setTodos = useTodoStore((s) => s.setTodos);

  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [isOpen, setIsOpen] = useState(false);

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
    let filteredTodos: Todo[] = [];

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
      <Pressable onPress={() => setIsOpen((prev) => !prev)}>
        <AddButton>
          <Text fontSize={32}>+</Text>
        </AddButton>
      </Pressable>
      {isOpen && (
        <>
          <Backdrop onPress={() => setIsOpen((prev) => !prev)} />
          <FrequencySelector />
        </>
      )}
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  backgroundColor: 'white',
});

const ItemSeparator = styled(View, {
  height: 6,
});

const AddButton = styled(View, {
  position: 'absolute',
  right: 30,
  bottom: 30,
  justifyContent: 'center',
  alignItems: 'center',
  width: 48,
  height: 48,
  borderRadius: 24,
  zIndex: 1,
  backgroundColor: 'gray',
});

const Backdrop = styled(View, {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
});

export default TodoScreen;

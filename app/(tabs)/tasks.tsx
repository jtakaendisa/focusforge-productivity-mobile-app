import { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { View, Text, styled } from 'tamagui';

import { Todo } from '../entities';
import { useTodoStore } from '../store';
import TodoItem from '../components/tabs/todo/TodoItem';
import SearchBar from '../components/tabs/todo/SearchBar';
import FilterBar from '../components/tabs/todo/FilterBar';
import FrequencySelector from '../components/tabs/todo/FrequencySelector';

const TasksScreen = () => {
  const todos = useTodoStore((s) => s.todos);
  const searchQuery = useTodoStore((s) => s.searchQuery);
  const filter = useTodoStore((s) => s.filter);
  const setTodos = useTodoStore((s) => s.setTodos);

  const [filteredTodos, setFilteredTodos] = useState(todos);
  const [isOpen, setIsOpen] = useState(false);

  const listRef = useRef<FlashList<Todo> | null>(null);

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
    listRef.current?.prepareForLayoutAnimationRender();
  };

  useEffect(() => {
    if (searchQuery.length) {
      const filteredTodos = todos.filter((todo) =>
        todo.task.toLowerCase().includes(searchQuery)
      );
      setFilteredTodos(filteredTodos);
    } else {
      setFilteredTodos(todos);
    }
    listRef.current?.prepareForLayoutAnimationRender();
  }, [searchQuery, todos, listRef]);

  useEffect(() => {
    let filteredTodos: Todo[] = [];

    switch (filter) {
      case 'all':
        filteredTodos = todos;
        break;
      case 'open':
        filteredTodos = todos.filter((todo) => todo.isCompleted === false);
        break;
      case 'completed':
        filteredTodos = todos.filter((todo) => todo.isCompleted === true);
        break;
      default:
        filteredTodos = todos;
        break;
    }

    setFilteredTodos(filteredTodos);
    listRef.current?.prepareForLayoutAnimationRender();
  }, [filter, todos, listRef]);

  return (
    <Container>
      <SearchBar />
      <FilterBar />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FlashList
          ref={listRef}
          data={filteredTodos}
          renderItem={({ item }) => (
            <TodoItem
              todo={item}
              onPress={handleTaskPress}
              onDelete={handleTaskDelete}
            />
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ItemSeparator}
          estimatedItemSize={20}
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
          <AnimatedBackdrop
            entering={FadeIn}
            exiting={FadeOut}
            onPress={() => setIsOpen((prev) => !prev)}
          />
          <FrequencySelector onClose={() => setIsOpen((prev) => !prev)} />
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

const AnimatedBackdrop = Animated.createAnimatedComponent(Backdrop);

export default TasksScreen;

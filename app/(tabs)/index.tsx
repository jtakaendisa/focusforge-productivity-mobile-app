import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { View, styled } from 'tamagui';

import { Todo } from '../entities';
import { useTodoStore } from '../store';
import { toFormattedDateString } from '../utils';
import TodoItem from '../components/tabs/todo/TodoItem';
import DateCarousel from '../components/tabs/home/DateCarousel';
import TasksPlaceholder from '../components/tabs/home/TasksPlaceholder';

const HomeScreen = () => {
  const todos = useTodoStore((s) => s.todos);
  const selectedDate = useTodoStore((s) => s.selectedDate);
  const setTodos = useTodoStore((s) => s.setTodos);

  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const listRef = useRef<FlashList<Todo> | null>(null);

  const isTasksEmpty = !filteredTodos.length;

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
    const filteredTodos = todos.filter(
      (todo) => todo.dueDate === toFormattedDateString(selectedDate)
    );
    setFilteredTodos(filteredTodos);
    listRef.current?.prepareForLayoutAnimationRender();
  }, [todos, selectedDate, listRef]);

  return (
    <Container>
      <DateCarousel />
      <TodosContainer isTasksEmpty={isTasksEmpty}>
        {isTasksEmpty ? (
          <TasksPlaceholder />
        ) : (
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
        )}
      </TodosContainer>
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  backgroundColor: '#111111',
});

const TodosContainer = styled(View, {
  flex: 1,
  marginTop: 16,
  variants: {
    isTasksEmpty: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  } as const,
});

const ItemSeparator = styled(View, {
  height: 6,
});

export default HomeScreen;

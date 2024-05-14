import { useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { Todo } from '../entities';
import { useTodoStore } from '../store';
import { toFormattedDateString } from '../utils';
import DateCarousel from '../components/tabs/home/DateCarousel';
import TaskListPlaceholder from '../components/tabs/home/TaskListPlaceholder';
import TaskList from '../components/tabs/home/TaskList';
import CreateTaskButton from '../components/tabs/CreateTaskButton';
import FrequencySelector from '../components/tabs/FrequencySelector';

const HomeScreen = () => {
  const todos = useTodoStore((s) => s.todos);
  const selectedDate = useTodoStore((s) => s.selectedDate);

  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const taskListRef = useRef<FlashList<Todo> | null>(null);
  const frequencySelectorRef = useRef<BottomSheetModal | null>(null);

  const isTasksEmpty = !filteredTodos.length;

  const handlePresentModalPress = () => frequencySelectorRef.current?.present();

  useEffect(() => {
    const filteredTodos = todos.filter(
      (todo) => todo.dueDate === toFormattedDateString(selectedDate)
    );
    setFilteredTodos(filteredTodos);
    taskListRef.current?.prepareForLayoutAnimationRender();
  }, [todos, selectedDate, taskListRef]);

  return (
    <Container>
      <DateCarousel />
      <TaskListContainer isTasksEmpty={isTasksEmpty}>
        {isTasksEmpty ? (
          <TaskListPlaceholder />
        ) : (
          <TaskList
            taskListRef={taskListRef}
            filteredTasks={filteredTodos}
            todos={todos}
          />
        )}
      </TaskListContainer>
      <CreateTaskButton onPress={handlePresentModalPress} />
      <FrequencySelector frequencySelectorRef={frequencySelectorRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  position: 'relative',
  backgroundColor: '#111111',
});

const TaskListContainer = styled(View, {
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

export default HomeScreen;

import { useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { TabRoute, Task } from '../../entities';
import { useAppStore, useTaskStore } from '../../store';
import { toFormattedDateString } from '../../utils';
import DateCarousel from '../../components/tabs/home/DateCarousel';
import ActivityListPlaceholder from '../../components/tabs/home/ActivityListPlaceholder';
import TaskList from '../../components/tabs/home/TaskList';
import CreateTaskButton from '../../components/tabs/CreateTaskButton';
import TaskFrequencyModal from '../../components/tabs/modals/TaskFrequencyModal';
import SearchBarSpacer from '@/app/components/tabs/SearchBarSpacer';
import { usePathname } from 'expo-router';

const HomeScreen = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const tasks = useTaskStore((s) => s.tasks);
  const selectedDate = useTaskStore((s) => s.selectedDate);

  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const taskListRef = useRef<FlashList<Task | (string | Task)> | null>(null);
  const taskFrequencyRef = useRef<BottomSheetModal | null>(null);

  const isTasksEmpty = !filteredTasks.length;

  const handlePresentModalPress = () => taskFrequencyRef.current?.present();

  useEffect(() => {
    const filteredTasks = tasks.filter(
      (task) =>
        toFormattedDateString(task.dueDate) === toFormattedDateString(selectedDate)
    );
    setFilteredTasks(filteredTasks);
    taskListRef.current?.prepareForLayoutAnimationRender();
  }, [tasks, selectedDate, taskListRef]);

  return (
    <Container>
      <SearchBarSpacer isExpanded={pathname === 'home' && isSearchBarOpen} />
      <DateCarousel />
      <TaskListContainer isTasksEmpty={isTasksEmpty}>
        {isTasksEmpty ? (
          <ActivityListPlaceholder />
        ) : (
          <TaskList
            taskListRef={taskListRef}
            filteredTasks={filteredTasks}
            tasks={tasks}
            isCheckable
          />
        )}
      </TaskListContainer>
      <CreateTaskButton onPress={handlePresentModalPress} />
      <TaskFrequencyModal taskFrequencyRef={taskFrequencyRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  position: 'relative',
  backgroundColor: '$customBlack1',
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

import { useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { TaskFilter, TabRoute, Task } from '../../entities';
import { useActivityStore, useAppStore, useTaskStore } from '../../store';
import CreateTaskButton from '../../components/tabs/NewActivityButton';
import TaskFrequencyModal from '../../components/tabs/modals/NewActivityModal';
import FilterBar from '../../components/tabs/tasks/FilterBar';
import TaskList from '../../components/tabs/home/TaskList';
import SearchBarSpacer from '@/app/components/tabs/SearchBarSpacer';
import { usePathname } from 'expo-router';

const TasksScreen = () => {
  return null;

  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const tasks = useTaskStore((s) => s.tasks);
  const filter = useTaskStore((s) => s.filter);
  const setFilter = useTaskStore((s) => s.setFilter);
  const filteredSingleTasks = useActivityStore((s) => s.filteredSingleTasks);
  const filteredRecurringTasks = useActivityStore((s) => s.filteredRecurringTasks);

  const [filteredTasks, setFilteredTasks] = useState<(string | Task)[]>([]);

  const tasklistRef = useRef<FlashList<Task | (string | Task)> | null>(null);
  const taskFrequencyRef = useRef<BottomSheetModal | null>(null);

  const handleSelectFilter = (filter: TaskFilter) => setFilter(filter);

  const handlePresentModalPress = () => taskFrequencyRef.current?.present();

  useEffect(() => {
    let filteredTasks: (string | Task)[] = [];

    if (filter === 'single') {
      filteredTasks = filteredSingleTasks;
    } else {
      filteredTasks = filteredRecurringTasks;
    }

    setFilteredTasks(filteredTasks);
    tasklistRef.current?.prepareForLayoutAnimationRender();
  }, [filter, filteredSingleTasks, filteredRecurringTasks, tasklistRef]);

  return (
    <Container>
      <SearchBarSpacer isExpanded={pathname === 'tasks' && isSearchBarOpen} />
      <FilterBar filter={filter} onSelect={handleSelectFilter} />
      <TaskList
        taskListRef={tasklistRef}
        filteredActivities={filteredTasks}
        tasks={tasks}
      />
      <CreateTaskButton onPress={handlePresentModalPress} />
      <TaskFrequencyModal taskFrequencyRef={taskFrequencyRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  backgroundColor: '$customBlack1',
});

export default TasksScreen;

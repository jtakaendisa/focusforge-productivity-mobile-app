import { useEffect, useMemo, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { Filter, TabRoute, Task } from '../../entities';
import { useAppStore, useTaskStore } from '../../store';
import { toDateGroupedTasks, toFormattedSections } from '../../utils';
import CreateTaskButton from '../../components/tabs/CreateTaskButton';
import TaskFrequencyModal from '../../components/tabs/modals/TaskFrequencyModal';
import FilterBar from '../../components/tabs/tasks/FilterBar';
import TaskList from '../../components/tabs/home/TaskList';
import SearchBarSpacer from '@/app/components/tabs/SearchBarSpacer';
import { usePathname } from 'expo-router';

const TasksScreen = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const tasks = useTaskStore((s) => s.tasks);

  const [filter, setFilter] = useState<Filter>('single');
  const [filteredTasks, setFilteredTasks] = useState<(string | Task)[]>([]);

  const tasklistRef = useRef<FlashList<Task | (string | Task)> | null>(null);
  const taskFrequencyRef = useRef<BottomSheetModal | null>(null);

  const singleSectionedTasks = useMemo(() => {
    const singleTasks = tasks.filter((task) => task.isRecurring === false);
    const dateGroupedTasks = toDateGroupedTasks(singleTasks);
    return toFormattedSections(dateGroupedTasks);
  }, [tasks]);

  const recurringTasks = useMemo(
    () => tasks.filter((task) => task.isRecurring === true),
    [tasks]
  );

  const handleSelectFilter = (filter: Filter) => setFilter(filter);

  const handlePresentModalPress = () => taskFrequencyRef.current?.present();

  useEffect(() => {
    let filteredTasks: (string | Task)[] = [];

    switch (filter) {
      case 'single':
        filteredTasks = singleSectionedTasks;
        break;
      case 'recurring':
        filteredTasks = recurringTasks;
        break;
    }

    setFilteredTasks(filteredTasks);

    tasklistRef.current?.prepareForLayoutAnimationRender();
  }, [filter, singleSectionedTasks, recurringTasks, tasklistRef]);

  return (
    <Container>
      <SearchBarSpacer isExpanded={pathname === 'tasks' && isSearchBarOpen} />
      <FilterBar filter={filter} onSelect={handleSelectFilter} />
      <TaskList taskListRef={tasklistRef} filteredTasks={filteredTasks} tasks={tasks} />
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

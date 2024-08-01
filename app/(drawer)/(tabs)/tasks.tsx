import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useRef, useState } from 'react';
import { View, styled } from 'tamagui';

import SearchBarSpacer from '@/app/components/tabs/SearchBarSpacer';
import { usePathname } from 'expo-router';
import NewActivityModal from '../../components/tabs/modals/NewActivityModal';
import NewActivityButton from '../../components/tabs/NewActivityButton';
import TaskFilterBar from '../../components/tabs/tasks/TaskFilterBar';
import TaskList from '../../components/tabs/tasks/TaskList';
import { TabRoute, TaskFilter } from '../../entities';
import { useSearchStore } from '../../store';

const TasksScreen = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useSearchStore((s) => s.isSearchBarOpen);

  const [taskFilter, setTaskFilter] = useState<TaskFilter>('single task');

  const newActivityModalRef = useRef<BottomSheetModal | null>(null);

  const handleTaskFilterSelect = (taskFilter: TaskFilter) => setTaskFilter(taskFilter);

  const toggleNewActivityModal = () => newActivityModalRef.current?.present();

  return (
    <Container>
      <SearchBarSpacer isExpanded={pathname === 'tasks' && isSearchBarOpen} />
      <TaskFilterBar taskFilter={taskFilter} onSelect={handleTaskFilterSelect} />
      <TaskList taskFilter={taskFilter} isSearchBarOpen={isSearchBarOpen} />
      <NewActivityButton onPress={toggleNewActivityModal} />
      <NewActivityModal newActivityModalRef={newActivityModalRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  backgroundColor: '$customBlack1',
});

export default TasksScreen;

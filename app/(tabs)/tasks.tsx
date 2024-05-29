import { useEffect, useMemo, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { Task } from '../entities';
import { useTaskStore } from '../store';
import { toDateGroupedTasks, toFormattedSections } from '../utils';
import CreateTaskButton from '../components/tabs/CreateTaskButton';
import TaskFrequencyModal from '../components/tabs/modals/TaskFrequencyModal';
import FilterBar from '../components/tabs/tasks/FilterBar';
import TaskList from '../components/tabs/home/TaskList';

const TasksScreen = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const filter = useTaskStore((s) => s.filter);

  const [filteredTasks, setFilteredTasks] = useState<(string | Task)[]>([]);

  const tasklistRef = useRef<FlashList<Task | (string | Task)> | null>(null);
  const taskFrequencyRef = useRef<BottomSheetModal | null>(null);

  const singleSectionedTasks = useMemo(() => {
    const singleTasks = tasks.filter((task) => task.isRecurring === false);
    const dateGroupedTasks = toDateGroupedTasks(singleTasks);
    const sectionedTasks = toFormattedSections(dateGroupedTasks);
    return sectionedTasks;
  }, [tasks]);

  const recurringSectionedTasks = useMemo(() => {
    const recurringTasks = tasks.filter((task) => task.isRecurring === true);
    const dateGroupedTasks = toDateGroupedTasks(recurringTasks);
    const sectionedTasks = toFormattedSections(dateGroupedTasks);
    return sectionedTasks;
  }, [tasks]);

  const handlePresentModalPress = () => taskFrequencyRef.current?.present();

  useEffect(() => {
    if (searchQuery.length) {
      const filteredTasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery)
      );
      setFilteredTasks(filteredTasks);
    } else {
      setFilteredTasks(tasks);
    }
    tasklistRef.current?.prepareForLayoutAnimationRender();
  }, [searchQuery, tasks, tasklistRef]);

  useEffect(() => {
    let filteredTasks: (string | Task)[] = [];

    switch (filter) {
      case 'single':
        filteredTasks = singleSectionedTasks;
        break;
      case 'recurring':
        filteredTasks = recurringSectionedTasks;
        break;
    }

    setFilteredTasks(filteredTasks);

    tasklistRef.current?.prepareForLayoutAnimationRender();
  }, [filter, tasks, tasklistRef]);

  return (
    <Container>
      {/* <SearchBar /> */}
      <FilterBar />
      <TaskList
        taskListRef={tasklistRef}
        filteredTasks={filteredTasks}
        tasks={tasks}
        isSectioned
      />
      <CreateTaskButton onPress={handlePresentModalPress} />
      <TaskFrequencyModal taskFrequencyRef={taskFrequencyRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  position: 'relative',
  backgroundColor: '#111111',
});

export default TasksScreen;

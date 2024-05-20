import { useEffect, useRef, useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { Task } from '../entities';
import { useTaskStore } from '../store';
import { toDateGroupedTasks, toFormattedSections } from '../utils';
import CreateTaskButton from '../components/tabs/CreateTaskButton';
import TaskFrequencyModal from '../components/tabs/modals/TaskFrequencyModal';
import TaskList from '../components/tabs/home/TaskList';

const TasksScreen = () => {
  const tasks = useTaskStore((s) => s.tasks);
  const searchQuery = useTaskStore((s) => s.searchQuery);
  const filter = useTaskStore((s) => s.filter);

  const [filteredTasks, setFilteredTasks] = useState<(string | Task)[]>([]);

  const tasklistRef = useRef<FlashList<Task | (string | Task)> | null>(null);
  const taskFrequencyRef = useRef<BottomSheetModal | null>(null);

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
    // tasklistRef.current?.prepareForLayoutAnimationRender();
  }, [searchQuery, tasks, tasklistRef]);

  useEffect(() => {
    let filteredTasks: Task[] = [];

    switch (filter) {
      case 'all':
        filteredTasks = tasks;
        break;
      case 'open':
        filteredTasks = tasks.filter((task) => task.isCompleted === false);
        break;
      case 'completed':
        filteredTasks = tasks.filter((task) => task.isCompleted === true);
        break;
      default:
        filteredTasks = tasks;
        break;
    }

    setFilteredTasks(filteredTasks);
    tasklistRef.current?.prepareForLayoutAnimationRender();
  }, [filter, tasks, tasklistRef]);

  useEffect(() => {
    const dateGroupedTasks = toDateGroupedTasks(tasks);
    const sectionedTasks = toFormattedSections(dateGroupedTasks);
    setFilteredTasks(sectionedTasks);
  }, [tasks]);

  return (
    <Container>
      {/* <SearchBar />
      <FilterBar /> */}
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

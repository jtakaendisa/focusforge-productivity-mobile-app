import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled, View, Text } from 'tamagui';

import { useTaskStore } from './store';
import { Task } from './entities';
import { StatusBar } from 'expo-status-bar';
import EditTask from './components/tabs/tasks/EditTask';

type SearchParams = {
  taskId: string;
};

const EditTaskScreen = () => {
  const { taskId } = useLocalSearchParams<SearchParams>();

  const tasks = useTaskStore((s) => s.tasks);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (selectedTask) {
      setSelectedTask(selectedTask);
    }
  }, [tasks, taskId]);

  if (!selectedTask) return null;

  return (
    <Container>
      <EditTask tasks={tasks} selectedTask={selectedTask} />
      <StatusBar style="light" />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  backgroundColor: '#111111',
});

export default EditTaskScreen;

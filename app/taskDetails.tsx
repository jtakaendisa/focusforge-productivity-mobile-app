import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled, Text, View } from 'tamagui';
import { useTaskStore } from './store';
import { useEffect, useState } from 'react';
import { Task } from './entities';
import TabBar from './components/tabs/habits/TabBar';
import EditTask from './components/tabs/tasks/EditTask';
import { StatusBar } from 'expo-status-bar';

export type TaskActiveTab = 'calendar' | 'edit';

type SearchParams = {
  activeTab: TaskActiveTab;
  taskId: string;
};

const TaskDetailsScreen = () => {
  const { activeTab: activeTabParam, taskId } = useLocalSearchParams<SearchParams>();

  const tasks = useTaskStore((s) => s.tasks);

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleSelectTab = (activeTab: TaskActiveTab) => setActiveTab(activeTab);

  useEffect(() => {
    const selectedTask = tasks.find((task) => task.id === taskId);
    if (selectedTask) {
      setSelectedTask(selectedTask);
    }
  }, [tasks, taskId]);

  if (!selectedTask) return null;

  return (
    <Container>
      <ScreenLabel>
        <LabelTextLarge>Task Details</LabelTextLarge>
      </ScreenLabel>
      <TabBar mode="task" activeTab={activeTab} onSelect={handleSelectTab} />
      {activeTab === 'calendar' && <Text>Calendar</Text>}
      {activeTab === 'edit' && <EditTask tasks={tasks} selectedTask={selectedTask} />}
      <StatusBar style="light" />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  // backgroundColor: '#111111',
});

const ScreenLabel = styled(View, {
  alignSelf: 'flex-start',
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginLeft: 8,
  marginBottom: 8,
  borderRadius: 6,
  backgroundColor: '#262626',
});

const LabelTextLarge = styled(Text, {
  fontSize: 18,
  fontWeight: 'bold',
});

export default TaskDetailsScreen;

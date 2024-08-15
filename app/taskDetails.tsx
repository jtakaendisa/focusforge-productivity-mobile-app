import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled, Text, View } from 'tamagui';
import TabBar from './components/tabs/habits/TabBar';
import EditTask from './components/tabs/tasks/EditTask';
import { Activity, TaskActiveTab } from './entities';
import { useActivityStore } from './store';
import ActivityCalendar from './components/tabs/ActivityCalendar';

type SearchParams = {
  activeTab: TaskActiveTab;
  taskId: string;
};

const TaskDetailsScreen = () => {
  const { activeTab: activeTabParam, taskId } = useLocalSearchParams<SearchParams>();

  const activities = useActivityStore((s) => s.activities);

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [selectedTask, setSelectedTask] = useState<Activity | null>(null);

  const isRecurring = selectedTask?.type === 'recurring task';

  const handleSelectTab = (activeTab: TaskActiveTab) => setActiveTab(activeTab);

  useEffect(() => {
    const selectedTask = activities.find((activity) => activity.id === taskId);
    if (selectedTask) {
      setSelectedTask(selectedTask);
    }
  }, [activities, taskId]);

  if (!selectedTask) return null;

  return (
    <Container>
      <ScreenLabel>
        <LabelTextLarge>Task Details</LabelTextLarge>
      </ScreenLabel>
      {isRecurring && (
        <TabBar mode="task" activeTab={activeTab} onSelect={handleSelectTab} />
      )}
      {activeTab === 'calendar' && <ActivityCalendar selectedActivity={selectedTask} />}
      {activeTab === 'edit' && (
        <EditTask
          activities={activities}
          selectedTask={selectedTask}
          isRecurring={isRecurring}
        />
      )}
      <StatusBar style="light" />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
});

const ScreenLabel = styled(View, {
  alignSelf: 'flex-start',
  paddingHorizontal: 12,
  paddingVertical: 8,
  marginLeft: 8,
  marginBottom: 8,
  borderRadius: 6,
  backgroundColor: '$customGray2',
});

const LabelTextLarge = styled(Text, {
  fontSize: 18,
  fontWeight: 'bold',
});

export default TaskDetailsScreen;

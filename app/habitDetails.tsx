import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled, Text, View } from 'tamagui';

import EditHabit from './components/tabs/habits/EditHabit';
import HabitCalendar from './components/tabs/habits/HabitCalendar';
import HabitStatistics from './components/tabs/habits/HabitStatistics';
import TabBar from './components/tabs/habits/TabBar';
import { Activity, HabitActiveTab } from './entities';
import { useActivityStore } from './store';

type SearchParams = {
  activeTab: HabitActiveTab;
  habitId: string;
};

const HabitDetailsScreen = () => {
  const { activeTab: activeTabParam, habitId } = useLocalSearchParams<SearchParams>();

  const activities = useActivityStore((s) => s.activities);

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [selectedHabit, setSelectedHabit] = useState<Activity | null>(null);

  const handleSelectTab = (activeTab: HabitActiveTab) => setActiveTab(activeTab);

  useEffect(() => {
    const selectedHabit = activities.find((activity) => activity.id === habitId);
    if (selectedHabit) {
      setSelectedHabit(selectedHabit);
    }
  }, [activities, habitId]);

  if (!selectedHabit) return null;

  return (
    <Container>
      <ScreenLabel>
        <LabelTextLarge>Habit Details</LabelTextLarge>
      </ScreenLabel>
      <TabBar mode="habit" activeTab={activeTab} onSelect={handleSelectTab} />
      {activeTab === 'calendar' && <HabitCalendar selectedHabit={selectedHabit} />}
      {activeTab === 'statistics' && <HabitStatistics selectedHabit={selectedHabit} />}
      {activeTab === 'edit' && (
        <EditHabit activities={activities} selectedHabit={selectedHabit} />
      )}
      <StatusBar style="light" />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  backgroundColor: '$customBlack1',
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

export default HabitDetailsScreen;

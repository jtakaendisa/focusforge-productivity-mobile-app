import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled, Text, View } from 'tamagui';

import ActivityCalendar from './components/tabs/ActivityCalendar';
import EditHabit from './components/tabs/habits/EditHabit';
import HabitStatistics from './components/tabs/habits/HabitStatistics';
import TabBar from './components/tabs/habits/TabBar';
import { Activity, CompletionDatesMap, HabitActiveTab } from './entities';
import { useActivityStore } from './store';
import {
  calculateStreaks,
  getCompletionDatesFromStorage,
  setCompletionDatesInStorage,
  toFormattedDateString,
} from './utils';

type SearchParams = {
  activeTab: HabitActiveTab;
  habitId: string;
};

const HabitDetailsScreen = () => {
  const { activeTab: activeTabParam, habitId } = useLocalSearchParams<SearchParams>();

  const activities = useActivityStore((s) => s.activities);

  const [activeTab, setActiveTab] = useState(activeTabParam);
  const [selectedHabit, setSelectedHabit] = useState<Activity | null>(null);
  const [completionDatesMap, setCompletionDatesMap] =
    useState<CompletionDatesMap | null>(null);

  const { currentStreak, bestStreak } = useMemo(() => {
    if (selectedHabit && completionDatesMap) {
      return calculateStreaks(completionDatesMap[selectedHabit.id]);
    } else {
      return { currentStreak: 0, bestStreak: 0 };
    }
  }, [selectedHabit, completionDatesMap]);

  const handleSelectTab = (activeTab: HabitActiveTab) => setActiveTab(activeTab);

  const handleComplete = async (selectedDate?: string) => {
    if (!selectedDate?.length || !completionDatesMap || !selectedHabit) return;

    const formattedDate = toFormattedDateString(new Date(selectedDate));

    const updatedCompletionDates = completionDatesMap[selectedHabit.id].map((entry) =>
      entry.date === formattedDate
        ? { ...entry, isCompleted: !entry.isCompleted }
        : entry
    );

    const updatedCompletionDatesMap = {
      ...completionDatesMap,
      [selectedHabit.id]: updatedCompletionDates,
    };
    await setCompletionDatesInStorage(updatedCompletionDatesMap);
    setCompletionDatesMap(updatedCompletionDatesMap);
  };

  useEffect(() => {
    const selectedHabit = activities.find((activity) => activity.id === habitId);
    if (selectedHabit) {
      setSelectedHabit(selectedHabit);
    }
  }, [activities, habitId]);

  useEffect(() => {
    const fetchCompletionDatesMap = async () => {
      const completionDatesMap = await getCompletionDatesFromStorage();
      setCompletionDatesMap(completionDatesMap);
    };
    fetchCompletionDatesMap();
  }, []);

  if (!selectedHabit || !completionDatesMap) return null;

  return (
    <Container>
      <ScreenLabel>
        <LabelTextLarge>{selectedHabit.title}</LabelTextLarge>
      </ScreenLabel>
      <TabBar mode="habit" activeTab={activeTab} onSelect={handleSelectTab} />
      {activeTab === 'calendar' && (
        <ActivityCalendar
          completionDates={completionDatesMap[selectedHabit.id]}
          selectedActivity={selectedHabit}
          currentStreak={currentStreak}
          onComplete={handleComplete}
        />
      )}
      {activeTab === 'statistics' && (
        <HabitStatistics
          completionDates={completionDatesMap[selectedHabit.id]}
          currentStreak={currentStreak}
          bestStreak={bestStreak}
        />
      )}
      {activeTab === 'edit' && (
        <EditHabit activities={activities} selectedHabit={selectedHabit} />
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

export default HabitDetailsScreen;

import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'tamagui';

import TabBar from './components/habits/TabBar';

export type ActiveTab = 'calendar' | 'statistics' | 'edit';

type SearchParams = {
  activeTab: ActiveTab;
};

const HabitDetailsScreen = () => {
  const { activeTab: activeTabParam } = useLocalSearchParams<SearchParams>();

  const [activeTab, setActiveTab] = useState(activeTabParam);

  const handleSelectTab = (activeTab: ActiveTab) => {
    setActiveTab(activeTab);
  };

  return (
    <Container>
      <TabBar activeTab={activeTab} onSelect={handleSelectTab} />
    </Container>
  );
};

const Container = styled(SafeAreaView, {
  flex: 1,
  backgroundColor: '#111111',
});

export default HabitDetailsScreen;

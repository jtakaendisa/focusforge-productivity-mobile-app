import { useRef, useState } from 'react';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { Habit } from '@/app/entities';
import { useHabitStore } from '@/app/store';
import HabitListItem from './HabitListItem';
import ActivityOptionsModal from './ActivityOptionsModal';

interface Props {
  habits: Habit[];
  filteredHabits: Habit[];
}

const HabitList = ({ habits, filteredHabits }: Props) => {
  const setHabits = useHabitStore((s) => s.setHabits);

  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const habitListRef = useRef<FlashList<Habit> | null>(null);
  const activityOptionsRef = useRef<BottomSheetModal | null>(null);

  const handleDelete = () => {
    const filteredHabits = habits.filter((habit) => habit.id !== selectedHabit?.id);
    setHabits(filteredHabits);
    setSelectedHabit(null);
  };

  const handlePresentActivityOptionsModal = (habit: Habit) => {
    setSelectedHabit(habit);
    activityOptionsRef.current?.present();
  };

  const navigateToHabitDetailsScreen = (activeTab: string, habitId: string) => {
    if (!habitId.length) return;

    activityOptionsRef.current?.dismiss();
    router.push({
      pathname: '/habitDetails',
      params: { activeTab, habitId },
    });
  };

  return (
    <Container>
      <AnimatedFlashList
        ref={habitListRef}
        data={filteredHabits}
        renderItem={({ item }) => (
          <HabitListItem
            habit={item}
            showOptions={handlePresentActivityOptionsModal}
            onNavigate={navigateToHabitDetailsScreen}
          />
        )}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.id}
        estimatedItemSize={180}
      />
      <ActivityOptionsModal
        mode="habit"
        activityOptionsRef={activityOptionsRef}
        selectedActivity={selectedHabit}
        onDelete={handleDelete}
        onNavigate={navigateToHabitDetailsScreen}
      />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  paddingTop: 12,
  paddingHorizontal: 8,
});

const ItemSeparator = styled(View, {
  height: 12,
});

export default HabitList;

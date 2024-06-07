import { useRef } from 'react';
import { FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { styled, View } from 'tamagui';

import { Habit } from '../entities';
import { useHabitStore } from '../store';
import HabitList from '../components/habits/HabitList';
import CreateTaskButton from '../components/tabs/CreateTaskButton';
import TaskFrequencyModal from '../components/tabs/modals/TaskFrequencyModal';
import ActivityListPlaceholder from '../components/tabs/home/ActivityListPlaceholder';
import HabitOptionsModal from '../components/habits/HabitOptionsModal';

const HabitsScreen = () => {
  const habits = useHabitStore((s) => s.habits);

  const habitListRef = useRef<FlashList<Habit> | null>(null);
  const taskFrequencyRef = useRef<BottomSheetModal | null>(null);

  const isHabitsEmpty = !habits.length;

  const handlePresentTaskFrequencyModal = () => taskFrequencyRef.current?.present();

  return (
    <Container>
      <HabitListContainer isHabitsEmpty={isHabitsEmpty}>
        {isHabitsEmpty ? (
          <ActivityListPlaceholder />
        ) : (
          <HabitList
            habitListRef={habitListRef}
            habits={habits}
            filteredHabits={habits}
          />
        )}
      </HabitListContainer>
      <CreateTaskButton onPress={handlePresentTaskFrequencyModal} />
      <TaskFrequencyModal taskFrequencyRef={taskFrequencyRef} />
    </Container>
  );
};

const Container = styled(View, {
  flex: 1,
  position: 'relative',
  backgroundColor: '#111111',
});

const HabitListContainer = styled(View, {
  flex: 1,
  marginTop: 16,
  variants: {
    isHabitsEmpty: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  } as const,
});

export default HabitsScreen;

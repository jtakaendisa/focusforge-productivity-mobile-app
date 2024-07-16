import { useRef } from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { styled, View } from 'tamagui';

import { useActivityStore, useAppStore, useHabitStore } from '../../store';
import HabitList from '../../components/tabs/habits/HabitList';
import CreateTaskButton from '../../components/tabs/CreateTaskButton';
import TaskFrequencyModal from '../../components/tabs/modals/TaskFrequencyModal';
import ActivityListPlaceholder from '../../components/tabs/home/ActivityListPlaceholder';
import SearchBarSpacer from '@/app/components/tabs/SearchBarSpacer';
import { usePathname } from 'expo-router';
import { TabRoute } from '@/app/entities';

const HabitsScreen = () => {
  const pathname = (usePathname().substring(1) || 'home') as TabRoute;

  const isSearchBarOpen = useAppStore((s) => s.isSearchBarOpen);
  const filteredHabits = useActivityStore((s) => s.filteredHabits);

  const taskFrequencyRef = useRef<BottomSheetModal | null>(null);

  const isHabitsEmpty = !filteredHabits.length;

  const handlePresentTaskFrequencyModal = () => taskFrequencyRef.current?.present();

  return (
    <Container>
      <SearchBarSpacer isExpanded={pathname === 'habits' && isSearchBarOpen} />
      <HabitListContainer isCentered={isHabitsEmpty}>
        {isHabitsEmpty ? (
          <ActivityListPlaceholder />
        ) : (
          <HabitList habits={filteredHabits} />
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
  backgroundColor: '$customBlack1',
});

const HabitListContainer = styled(View, {
  flex: 1,
  marginTop: 16,
  variants: {
    isCentered: {
      true: {
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  } as const,
});

export default HabitsScreen;

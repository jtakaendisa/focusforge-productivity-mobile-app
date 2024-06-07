import { MutableRefObject, useRef } from 'react';
import { AnimatedFlashList, FlashList } from '@shopify/flash-list';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { View, styled } from 'tamagui';

import { Habit } from '@/app/entities';
import HabitListItem from './HabitListItem';
import HabitOptionsModal from './HabitOptionsModal';

interface Props {
  habitListRef: MutableRefObject<FlashList<Habit> | null>;
  habits: Habit[];
  filteredHabits: Habit[];
}

const HabitList = ({ habitListRef, habits, filteredHabits }: Props) => {
  const habitOptionsRef = useRef<BottomSheetModal | null>(null);

  const handlePresentHabitOptionsModal = () => habitOptionsRef.current?.present();

  return (
    <Container>
      <AnimatedFlashList
        ref={habitListRef}
        data={filteredHabits}
        renderItem={({ item }) => (
          <HabitListItem habit={item} showOptions={handlePresentHabitOptionsModal} />
        )}
        ItemSeparatorComponent={ItemSeparator}
        keyExtractor={(item) => item.id}
        estimatedItemSize={180}
      />
      <HabitOptionsModal habitOptionsRef={habitOptionsRef} />
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
